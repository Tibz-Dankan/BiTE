import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Chess } from "chess.js";
import { chessPuzzleAPI } from "../api/chessPuzzle";
import { useGetNextPuzzle } from "./useGetNextPuzzle";
import { useSubmitPuzzleAttempt } from "./useSubmitPuzzleAttempt";
import { useChessUserRating } from "./useChessUserRating";
import { useChessPuzzleStore } from "../stores/chessPuzzle";
import { playMoveSound, playResultSound } from "../utils/chessSound";
import type {
  TChessAttemptResult,
  TChessPuzzleNext,
  TChessSolverColor,
} from "../types/chessPuzzle";

export type TSolverStatus =
  | "loading"
  | "opponent-moving"
  | "waiting-user"
  | "checking"
  | "wrong"
  | "promoting"
  | "solved"
  | "gaveup";

export type TPromotionRole = "q" | "r" | "b" | "n";

export interface TBoardState {
  fen: string;
  orientation: TChessSolverColor;
  turnColor: TChessSolverColor;
  movableColor: TChessSolverColor;
  dests: Map<string, string[]>;
  lastMove?: [string, string];
  viewOnly: boolean;
  // version bumped on every mutation so the board wrapper always re-syncs,
  // even when the fen is unchanged (e.g. reverting a promotion drag).
  v: number;
}

const uciParts = (uci: string) => ({
  from: uci.slice(0, 2),
  to: uci.slice(2, 4),
  promo: uci.slice(4),
});

const computeDests = (chess: Chess): Map<string, string[]> => {
  const dests = new Map<string, string[]>();
  for (const m of chess.moves({ verbose: true })) {
    const arr = dests.get(m.from) ?? [];
    arr.push(m.to);
    dests.set(m.from, arr);
  }
  return dests;
};

const OPPONENT_DELAY_MS = 300;
const WRONG_RESET_MS = 500;

export const usePuzzleSolver = () => {
  const difficulty = useChessPuzzleStore((s) => s.difficulty);
  const [searchParams, setSearchParams] = useSearchParams();
  // Read once at mount so this only resumes a puzzle on an actual page
  // load/refresh, not on a later in-app edit of the URL.
  const initialPuzzleIdRef = useRef(searchParams.get("cpi") ?? undefined);
  const { puzzle, isLoading, isFetching, isError, error, refetch } =
    useGetNextPuzzle(difficulty, initialPuzzleIdRef.current);
  const submit = useSubmitPuzzleAttempt();
  // Live rating, refetched automatically after every attempt (see
  // useSubmitPuzzleAttempt's invalidation) and on window refocus — the
  // source of truth for the on-screen number, not a point-in-time snapshot.
  const { rating: userRating } = useChessUserRating();

  const [board, setBoard] = useState<TBoardState>({
    fen: "8/8/8/8/8/8/8/8 w - - 0 1",
    orientation: "white",
    turnColor: "white",
    movableColor: "white",
    dests: new Map(),
    viewOnly: true,
    v: 0,
  });
  const [status, setStatus] = useState<TSolverStatus>("loading");
  const [result, setResult] = useState<TChessAttemptResult | null>(null);
  const [sanHistory, setSanHistory] = useState<string[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{
    orig: string;
    dest: string;
  } | null>(null);

  const chessRef = useRef<Chess | null>(null);
  const puzzleRef = useRef<TChessPuzzleNext | null>(null);
  const plyRef = useRef(0);
  const userMovesRef = useRef<string[]>([]);
  const mistakesRef = useRef(0);
  const startTimeRef = useRef(0);

  const patchBoard = (patch: Partial<TBoardState>) =>
    setBoard((prev) => ({ ...prev, ...patch, v: prev.v + 1 }));

  // The "engine": all mutating logic, refreshed each render and reached through
  // a ref so setTimeout callbacks and chessground events never see a stale
  // closure. Everything reads refs, so calling a slightly older instance is
  // still correct.
  const engine = useRef<{
    enterWaitingUser: (lastMove?: [string, string]) => void;
    playOpponentReply: (uci: string) => void;
    handleUserMove: (o: string, d: string, p?: string) => Promise<void>;
    finishWin: () => Promise<void>;
    replaySolution: (solution: string[]) => void;
    startPuzzle: (p: TChessPuzzleNext) => void;
  }>({
    enterWaitingUser: () => {},
    playOpponentReply: () => {},
    handleUserMove: async () => {},
    finishWin: async () => {},
    replaySolution: () => {},
    startPuzzle: () => {},
  });

  const enterWaitingUser = (lastMove?: [string, string]) => {
    const chess = chessRef.current;
    const p = puzzleRef.current;
    if (!chess || !p) return;
    setStatus("waiting-user");
    patchBoard({
      fen: chess.fen(),
      turnColor: p.solverColor,
      movableColor: p.solverColor,
      dests: computeDests(chess),
      lastMove,
      viewOnly: false,
    });
  };

  const playOpponentReply = (uci: string) => {
    const chess = chessRef.current;
    if (!chess) return;
    const { from, to, promo } = uciParts(uci);
    let moved = null;
    try {
      moved = chess.move({ from, to, promotion: promo || undefined });
    } catch {
      moved = null;
    }
    if (moved) playMoveSound(moved.san);
    plyRef.current += 1;
    setSanHistory(chess.history());
    enterWaitingUser([from, to]);
  };

  const finishWin = async () => {
    const p = puzzleRef.current;
    if (!p) return;
    setStatus("solved");
    patchBoard({ viewOnly: true, dests: new Map() });
    playResultSound(true);
    const timeMs = Date.now() - startTimeRef.current;
    try {
      const res = await submit.mutateAsync({
        puzzleId: p.puzzleId,
        win: true,
        timeMs,
        moves: userMovesRef.current,
        mistakes: mistakesRef.current,
      });
      setResult(res);
    } catch {
      // The puzzle is solved visually even if the result submission fails.
    }
  };

  const handleUserMove = async (orig: string, dest: string, promo?: string) => {
    const chess = chessRef.current;
    const p = puzzleRef.current;
    if (!chess || !p) return;

    // Promotion: hold the move until the user picks a piece.
    if (!promo) {
      const isPromotion = chess
        .moves({ verbose: true })
        .some((m) => m.from === orig && m.to === dest && m.promotion);
      if (isPromotion) {
        setPendingPromotion({ orig, dest });
        setStatus("promoting");
        patchBoard({ fen: chess.fen(), viewOnly: true }); // revert drag visually
        return;
      }
    }

    const prevLastMove = board.lastMove;
    let moved = null;
    try {
      moved = chess.move({ from: orig, to: dest, promotion: promo || undefined });
    } catch {
      moved = null;
    }
    if (!moved) {
      patchBoard({ fen: chess.fen() });
      return;
    }

    setSanHistory(chess.history());
    playMoveSound(moved.san);
    setStatus("checking");
    patchBoard({
      fen: chess.fen(),
      lastMove: [orig, dest],
      viewOnly: true,
      dests: new Map(),
    });

    const uci = orig + dest + (promo || "");
    const ply = plyRef.current;

    try {
      const v = (
        await chessPuzzleAPI.validateMove({ puzzleId: p.puzzleId, ply, uci })
      ).data;

      if (!v.correct) {
        chess.undo();
        mistakesRef.current += 1;
        setSanHistory(chess.history());
        playResultSound(false);
        setStatus("wrong");
        window.setTimeout(() => {
          if (puzzleRef.current?.puzzleId !== p.puzzleId) return;
          engine.current.enterWaitingUser(prevLastMove);
        }, WRONG_RESET_MS);
        return;
      }

      userMovesRef.current.push(uci);
      plyRef.current += 1;

      if (v.solved || !v.opponentReply) {
        await engine.current.finishWin();
        return;
      }

      const reply = v.opponentReply;
      setStatus("opponent-moving");
      window.setTimeout(() => {
        if (puzzleRef.current?.puzzleId !== p.puzzleId) return;
        engine.current.playOpponentReply(reply);
      }, OPPONENT_DELAY_MS);
    } catch {
      // Network/validation error — revert the move and let the user retry.
      chess.undo();
      setSanHistory(chess.history());
      engine.current.enterWaitingUser(prevLastMove);
    }
  };

  const replaySolution = (solution: string[]) => {
    const p = puzzleRef.current;
    if (!p) return;
    const chess = new Chess(p.fen);
    chessRef.current = chess;
    setSanHistory([]);
    patchBoard({
      fen: chess.fen(),
      orientation: p.solverColor,
      lastMove: undefined,
      viewOnly: true,
      dests: new Map(),
    });

    let i = 0;
    const step = () => {
      if (puzzleRef.current?.puzzleId !== p.puzzleId) return;
      if (i >= solution.length) return;
      const { from, to, promo } = uciParts(solution[i]);
      let moved = null;
      try {
        moved = chess.move({ from, to, promotion: promo || undefined });
      } catch {
        moved = null;
      }
      if (moved) playMoveSound(moved.san);
      setSanHistory(chess.history());
      patchBoard({ fen: chess.fen(), lastMove: [from, to] });
      i += 1;
      window.setTimeout(step, 600);
    };
    window.setTimeout(step, 500);
  };

  const startPuzzle = (p: TChessPuzzleNext) => {
    const chess = new Chess(p.fen);
    chessRef.current = chess;
    puzzleRef.current = p;
    plyRef.current = 0;
    userMovesRef.current = [];
    mistakesRef.current = 0;
    startTimeRef.current = Date.now();
    setResult(null);
    setPendingPromotion(null);
    setSanHistory([]);
    setStatus("opponent-moving");
    setBoard({
      fen: chess.fen(),
      orientation: p.solverColor,
      turnColor: p.solverColor,
      movableColor: p.solverColor,
      dests: new Map(),
      lastMove: undefined,
      viewOnly: true,
      v: 0,
    });

    window.setTimeout(() => {
      if (puzzleRef.current?.puzzleId !== p.puzzleId) return;
      const { from, to, promo } = uciParts(p.setupMove);
      let moved = null;
      try {
        moved = chess.move({ from, to, promotion: promo || undefined });
      } catch {
        moved = null;
      }
      if (moved) playMoveSound(moved.san);
      plyRef.current = 1;
      setSanHistory(chess.history());
      engine.current.enterWaitingUser([from, to]);
    }, 350);
  };

  // Refresh the engine with this render's closures.
  engine.current.enterWaitingUser = enterWaitingUser;
  engine.current.playOpponentReply = playOpponentReply;
  engine.current.handleUserMove = handleUserMove;
  engine.current.finishWin = finishWin;
  engine.current.replaySolution = replaySolution;
  engine.current.startPuzzle = startPuzzle;

  // Stable callbacks handed to children / chessground.
  const onBoardMove = useCallback((orig: string, dest: string) => {
    void engine.current.handleUserMove(orig, dest);
  }, []);

  const choosePromotion = useCallback((role: TPromotionRole) => {
    setPendingPromotion((pending) => {
      if (pending) void engine.current.handleUserMove(pending.orig, pending.dest, role);
      return null;
    });
  }, []);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion((pending) => {
      if (pending) engine.current.enterWaitingUser();
      return null;
    });
  }, []);

  const giveUp = useCallback(async () => {
    const p = puzzleRef.current;
    if (!p) return;
    setStatus((prev) => {
      if (prev === "solved" || prev === "gaveup") return prev;
      return "gaveup";
    });
    patchBoard({ viewOnly: true, dests: new Map() });
    const timeMs = Date.now() - startTimeRef.current;
    try {
      const res = await submit.mutateAsync({
        puzzleId: p.puzzleId,
        win: false,
        timeMs,
        moves: userMovesRef.current,
        mistakes: mistakesRef.current,
      });
      setResult(res);
      engine.current.replaySolution(res.solution);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNext = useCallback(() => {
    void refetch();
  }, [refetch]);

  // Start a fresh puzzle whenever a new one arrives.
  useEffect(() => {
    if (puzzle) engine.current.startPuzzle(puzzle);
  }, [puzzle]);

  // Keep the URL's `cpi` param in sync with whichever puzzle is on screen,
  // so a refresh resumes the same puzzle. Left untouched if it already
  // matches (no redundant history entry).
  useEffect(() => {
    if (!puzzle) return;
    if (searchParams.get("cpi") === puzzle.puzzleId) return;
    setSearchParams(
      (prev) => {
        prev.set("cpi", puzzle.puzzleId);
        return prev;
      },
      { replace: true },
    );
  }, [puzzle, searchParams, setSearchParams]);

  return {
    board,
    status,
    result,
    sanHistory,
    pendingPromotion,
    puzzle,
    userRating,
    isLoading,
    isFetching,
    isError,
    error,
    submitting: submit.isPending,
    onBoardMove,
    choosePromotion,
    cancelPromotion,
    giveUp,
    loadNext,
  };
};
