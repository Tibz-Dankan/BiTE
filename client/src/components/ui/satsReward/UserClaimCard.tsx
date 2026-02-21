import React, { useState } from "react";
import type { SatsClaimQuiz } from "../../../types/satsReward";
import {
  Calendar,
  CheckCircle2,
  HelpCircle,
  Bitcoin,
  Award,
} from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { Button } from "../shared/Btn";
import { ClaimRewardModal } from "./ClaimRewardModal";

interface UserClaimCardProps {
  claim: SatsClaimQuiz;
}

export const UserClaimCard: React.FC<UserClaimCardProps> = ({ claim }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rewardAmount = claim.correctQuestionCount * 1;

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
                {claim.quiz?.title || "Quiz"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  Completed {formatDate(claim.createdAt)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {claim.totalQuestions} questions
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    {claim.correctQuestionCount} correct
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bitcoin size={14} className="text-amber-500" />
                  <span className="text-xs text-amber-600 font-semibold">
                    {rewardAmount} Sats
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

      <ClaimRewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        claim={claim}
      />
    </>
  );
};
