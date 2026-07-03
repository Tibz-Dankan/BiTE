import React, { useEffect, useRef } from "react";
import { Chessground } from "@lichess-org/chessground";
import type { Api } from "@lichess-org/chessground/api";
import type { Config } from "@lichess-org/chessground/config";
import type { Dests, Key } from "@lichess-org/chessground/types";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";
// Local overrides — must come after the chessground CSS above.
import "./Chessboard.css";

import type { TChessSolverColor } from "../../../types/chessPuzzle";

interface ChessboardProps {
  fen: string;
  orientation: TChessSolverColor;
  turnColor: TChessSolverColor;
  movableColor: TChessSolverColor;
  dests: Map<string, string[]>;
  lastMove?: [string, string];
  viewOnly: boolean;
  showCoords: boolean;
  // Bumped on every board mutation so the wrapper always re-syncs, even when
  // the fen is unchanged.
  syncKey: number;
  onMove: (orig: string, dest: string) => void;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  orientation,
  turnColor,
  movableColor,
  dests,
  lastMove,
  viewOnly,
  showCoords,
  syncKey,
  onMove,
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const buildConfig = (): Config => ({
    fen,
    orientation,
    turnColor,
    coordinates: showCoords,
    // Must be false at init so chessground binds its mouse/touch listeners
    // (bindBoard skips binding when viewOnly is true, and runs only once).
    // Turn-by-turn interactivity is gated below via `movable.color`/`dests`.
    viewOnly: false,
    lastMove: lastMove as Key[] | undefined,
    highlight: { lastMove: true, check: true },
    animation: { enabled: true, duration: 250 },
    // Don't let a piece drag scroll the page on touch devices.
    blockTouchScroll: true,
    movable: {
      free: false,
      color: viewOnly ? undefined : movableColor,
      dests: dests as unknown as Dests,
      showDests: true,
      events: {
        after: (orig, dest) => onMoveRef.current(orig, dest),
      },
    },
    // Both drag-and-drop and tap-to-move (select piece → tap destination).
    draggable: { enabled: true, showGhost: true },
    selectable: { enabled: true },
    premovable: { enabled: false },
    drawable: { enabled: true, visible: true },
  });

  // Mount / unmount.
  useEffect(() => {
    if (!elRef.current) return;
    apiRef.current = Chessground(elRef.current, buildConfig());
    return () => {
      apiRef.current?.destroy();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync on any board mutation.
  useEffect(() => {
    apiRef.current?.set(buildConfig());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey, showCoords]);

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div ref={elRef} className="w-full aspect-square" />
    </div>
  );
};
