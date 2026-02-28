import React from "react";
import { Modal } from "../shared/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, Star } from "lucide-react";
import type { SatsRewardAddress } from "../../../types/satsReward";

interface MakeDefaultSatsRewardAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: SatsRewardAddress;
}

export const MakeDefaultSatsRewardAddressModal: React.FC<
  MakeDefaultSatsRewardAddressModalProps
> = ({ isOpen, onClose, address }) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: satsRewardAPI.makeDefaultAddress,
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
    mutate({ id: address.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-50 p-8 rounded-md max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Set as Default Address
        </h2>
        <div className="bg-amber-50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Star className="text-amber-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Confirm Default Address
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              This will set the following address as your default payout
              address. Any existing default address will be unset.
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
                Setting...
              </>
            ) : (
              "Set as Default"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
