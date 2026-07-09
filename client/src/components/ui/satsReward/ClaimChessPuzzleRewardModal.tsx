import React from "react";
import { Modal } from "../shared/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chessPuzzleAPI } from "../../../api/chessPuzzle";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, Bitcoin, Gauge, Puzzle } from "lucide-react";
import type { TChessClaimPuzzle } from "../../../types/chessPuzzle";

interface ClaimChessPuzzleRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: TChessClaimPuzzle;
}

export const ClaimChessPuzzleRewardModal: React.FC<
  ClaimChessPuzzleRewardModalProps
> = ({ isOpen, onClose, claim }) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: chessPuzzleAPI.claimPuzzleReward,
    onSuccess: (response) => {
      showCardNotification({ type: "success", message: response.message });
      queryClient.invalidateQueries({
        queryKey: ["claimableChessPuzzles", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userChessPuzzleSatsRewards", user.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userSatsRewardStats", user.id],
      });
      onClose();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
    },
  });

  const handleClaim = () => {
    mutate({ puzzleID: claim.chessPuzzleID });
  };

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
          <h3 className="text-base font-bold text-slate-800 mb-4 truncate">
            Puzzle {claim.chessPuzzleID}
          </h3>

          <div className="space-y-3">
            {claim.rating && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">Puzzle Rating</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {claim.rating}
                </span>
              </div>
            )}

            {claim.themes && claim.themes.length > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  <Puzzle size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">Themes</span>
                </div>
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {claim.themes.slice(0, 3).join(", ")}
                </span>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bitcoin size={16} className="text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Reward Amount
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {claim.satsEarned}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    Sats
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {claim.satsEarned} sats per solved puzzle
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Payment is sent in the background. This puzzle clears from your claims
          once the payout completes.
        </p>

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
