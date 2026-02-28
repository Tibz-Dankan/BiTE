import React from "react";
import { Modal } from "../shared/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, ShieldCheck } from "lucide-react";
import type { SatsRewardAddress } from "../../../types/satsReward";

interface VerifySatsRewardAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: SatsRewardAddress;
}

export const VerifySatsRewardAddressModal: React.FC<
  VerifySatsRewardAddressModalProps
> = ({ isOpen, onClose, address }) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: satsRewardAPI.verifyAddress,
    onSuccess: (response) => {
      showCardNotification({ type: "success", message: response.message });
      queryClient.invalidateQueries({
        queryKey: ["satsRewardAddresses", user.id],
      });
      onClose();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
    },
  });

  const handleConfirm = () => {
    mutate({ address: address.address });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-50 p-8 rounded-md max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Verify Payout Address
        </h2>
        <div className="bg-green-50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <ShieldCheck className="text-green-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-green-900">
              Address Verification
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              This will trigger a verification process for your payout address.
              A small amount of sats will be sent to confirm ownership.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl mb-6">
          <p className="text-sm font-mono text-slate-700 break-all leading-relaxed">
            {address.address}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="px-6 bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="px-8 min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Address"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
