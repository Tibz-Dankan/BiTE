import React from "react";
import { SCNButton } from "../../../ui/shared/button";
import {
  Puzzle,
  Target,
  Bitcoin,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../../stores/auth";

/**
 * Illustrative board position for the promo card only (not a real game state).
 * Depicts a back-rank mate: the white queen slides to the back rank beside the
 * black king. Square indices run 0..63, left-to-right, top-to-bottom.
 */
const BOARD_PIECES: Record<number, { glyph: string; side: "w" | "b" }> = {
  6: { glyph: "♚", side: "b" }, // black king
  13: { glyph: "♟", side: "b" }, // black pawn
  14: { glyph: "♟", side: "b" }, // black pawn
  15: { glyph: "♟", side: "b" }, // black pawn
  33: { glyph: "♞", side: "w" }, // white knight (support)
  1: { glyph: "♛", side: "w" }, // white queen (mating square)
};

// The winning move highlighted on the board: from-square -> to-square.
const MOVE_FROM = 25;
const MOVE_TO = 1;

const BOARD_SQUARES = Array.from({ length: 64 }, (_, i) => i);

// Mock stats shown in the promo card (consistent with RewardsSection's mock values).
const MOCK_RATING = 1428;
const MOCK_SATS = 21;

export const ChessPuzzlesSection: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const isLoggedInUser = !!auth.accessToken && auth.user.role === "USER";

  return (
    <section
      id="chess-puzzles"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2
        w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px]
        -z-10 opacity-70"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div className="space-y-6 md:order-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
              bg-amber-50 text-amber-700 text-sm font-semibold border
              border-amber-100"
            >
              <Puzzle size={14} />
              <span>Play &amp; Earn</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Solve Chess Puzzles, Earn{" "}
              <span className="text-[oklch(0.749_0.154_70.67)]">Bitcoin</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Sharpen your tactics with puzzles drawn from real games — find the
              winning move, watch the board celebrate, and get real Bitcoin sats
              paid straight to your Lightning wallet.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Matched to Your Level
                  </h4>
                  <p className="text-gray-600">
                    A personal rating adapts every puzzle to your skill, so
                    you're always challenged — never stuck.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mt-1">
                  <Bitcoin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Sats for Every Clean Solve
                  </h4>
                  <p className="text-gray-600">
                    Crack a puzzle without a mistake and real Bitcoin lands in
                    your Lightning wallet, instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 mt-1">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Sharpen Real Tactics
                  </h4>
                  <p className="text-gray-600">
                    Forks, pins, and mating nets — every puzzle is tagged by
                    theme and pulled from real games.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {isLoggedInUser ? (
                <SCNButton
                  asChild
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-purple-100"
                >
                  <Link to="/u/chess-puzzles">
                    Play Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </SCNButton>
              ) : (
                <>
                  <SCNButton
                    asChild
                    size="lg"
                    className="rounded-full px-8 shadow-lg shadow-purple-100"
                  >
                    <Link to="/auth/signup">Start Solving</Link>
                  </SCNButton>
                  <SCNButton
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 border-gray-200"
                  >
                    <Link to="/auth/signin">
                      Sign In to Play
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </SCNButton>
                </>
              )}
            </div>
          </div>

          {/* Visual mock */}
          <div className="relative md:order-1">
            <div
              className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl
              border border-gray-100 shadow-xl shadow-slate-100/50"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[oklch(0.749_0.154_70.67)] rounded-2xl text-white">
                    <Puzzle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Daily Tactic
                    </h3>
                    <p className="text-sm text-gray-500">White to move</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">
                    {MOCK_RATING}
                  </span>
                  <p className="text-xs font-bold text-amber-600 tracking-wider">
                    RATING
                  </p>
                </div>
              </div>

              {/* Chessboard mock */}
              <div className="grid grid-cols-8 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                {BOARD_SQUARES.map((square) => {
                  const row = Math.floor(square / 8);
                  const col = square % 8;
                  const isLight = (row + col) % 2 === 0;
                  const isMoveSquare =
                    square === MOVE_FROM || square === MOVE_TO;
                  const piece = BOARD_PIECES[square];

                  return (
                    <div
                      key={square}
                      className={`aspect-square flex items-center justify-center text-xl sm:text-2xl leading-none ${
                        isMoveSquare
                          ? "bg-[oklch(0.749_0.154_70.67)]/45"
                          : isLight
                            ? "bg-amber-50"
                            : "bg-amber-200/70"
                      }`}
                    >
                      {piece && (
                        <span
                          className={
                            piece.side === "w"
                              ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                              : "text-gray-800"
                          }
                        >
                          {piece.glyph}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Theme tags */}
              <div className="flex items-center gap-2 mt-6">
                <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                  Back-rank mate
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  Fork
                </span>
                <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  Endgame
                </span>
              </div>

              {/* Success callout */}
              <div
                className="mt-4 p-4 bg-slate-900 rounded-2xl text-white flex
                items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span className="font-bold">Best move!</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Bitcoin size={18} />
                  <span className="font-bold">+{MOCK_SATS} sats</span>
                </div>
              </div>
            </div>

            {/* Floaty */}
            <div
              className="absolute -bottom-6 -right-6 p-4 bg-white rounded-2xl
              shadow-lg border border-gray-100 animate-float"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 bg-green-100 rounded-full flex items-center
                  justify-center text-green-600"
                >
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-sm font-bold text-gray-900">Puzzle Solved!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
