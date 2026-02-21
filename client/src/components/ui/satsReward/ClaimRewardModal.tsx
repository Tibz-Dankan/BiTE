import React from "react";
import { Modal } from "../shared/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, Bitcoin, CheckCircle2, HelpCircle } from "lucide-react";
import type { SatsClaimQuiz } from "../../../types/satsReward";

interface ClaimRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: SatsClaimQuiz;
}

export const ClaimRewardModal: React.FC<ClaimRewardModalProps> = ({
  isOpen,
  onClose,
  claim,
}) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: satsRewardAPI.claimQuizReward,
    onSuccess: (response) => {
      showCardNotification({ type: "success", message: response.message });
      queryClient.invalidateQueries({
        queryKey: ["claimableQuizzes", user.id],
      });
      onClose();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
    },
  });

  const handleClaim = () => {
    mutate({ quizID: claim.quizID });
  };

  const rewardAmount = claim.correctQuestionCount * 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-50 p-8 rounded-md min-w-[360px] max-w-[480px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Bitcoin className="text-amber-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Claim Reward</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            {claim.quiz?.title || "Quiz"}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">Total Questions</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {claim.totalQuestions}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm text-slate-600">
                  Correct Questions
                </span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {claim.correctQuestionCount}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bitcoin size={16} className="text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Reward Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {rewardAmount}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    Sats
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                1 sat per correct question
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="px-6 bg-transparent border border-slate-300
              text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleClaim}
            disabled={isPending}
            className="px-8 min-w-[140px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Confirm Claim"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
