import React, { useState } from "react";
import type { TChessClaimPuzzle } from "../../../types/chessPuzzle";
import { Calendar, Gauge, Bitcoin, Award } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { Button } from "../shared/Btn";
import { ClaimChessPuzzleRewardModal } from "./ClaimChessPuzzleRewardModal";

interface UserChessPuzzleClaimCardProps {
  claim: TChessClaimPuzzle;
}

export const UserChessPuzzleClaimCard: React.FC<
  UserChessPuzzleClaimCardProps
> = ({ claim }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="w-full border border-gray-400 rounded-lg bg-white
        p-5 transition-all duration-200 hover:shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="p-3 bg-amber-50 rounded-xl shrink-0">
              <Award className="text-amber-600" size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-slate-800 truncate">
                Puzzle {claim.chessPuzzleID}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  Solved {formatDate(claim.solvedAt)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                {claim.rating && (
                  <div className="flex items-center gap-1.5">
                    <Gauge size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {claim.rating} rating
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Bitcoin size={14} className="text-amber-500" />
                  <span className="text-xs text-amber-600 font-semibold">
                    {claim.satsEarned} Sats
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 shrink-0"
          >
            Claim Reward
          </Button>
        </div>
      </div>

      <ClaimChessPuzzleRewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        claim={claim}
      />
    </>
  );
};
