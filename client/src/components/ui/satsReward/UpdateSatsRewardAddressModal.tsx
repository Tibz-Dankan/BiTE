import React from "react";
import { Modal } from "../shared/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { InputField } from "../shared/InputField";
import { Button } from "../shared/Btn";
import { Loader2, Pencil } from "lucide-react";
import type { SatsRewardAddress } from "../../../types/satsReward";

interface UpdateSatsRewardAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: SatsRewardAddress;
}

export const UpdateSatsRewardAddressModal: React.FC<
  UpdateSatsRewardAddressModalProps
> = ({ isOpen, onClose, address }) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: satsRewardAPI.updateAddress,
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

  const formik = useFormik({
    initialValues: {
      address: address.address,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      address: Yup.string().required("Sats address is required"),
    }),
    onSubmit: (values) => {
      mutate({ id: address.id, address: values.address });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-50 p-8 rounded-md">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Edit Payout Address
        </h2>
        <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Pencil className="text-indigo-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-indigo-900">
              Update Lightning Address
            </p>
            <p className="text-xs text-indigo-700 mt-0.5">
              Change your Lightning address. The new address must be unique.
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField
            label="Sats Address"
            name="address"
            type="text"
            placeholder="e.g. yourname@blink.sv"
            formik={formik}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Address"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
