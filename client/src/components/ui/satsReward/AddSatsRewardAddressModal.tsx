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
import { Loader2, Wallet } from "lucide-react";

interface AddSatsRewardAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSatsRewardAddressModal: React.FC<
  AddSatsRewardAddressModalProps
> = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.auth.user);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: satsRewardAPI.postAddress,
    onSuccess: (response) => {
      showCardNotification({ type: "success", message: response.message });
      queryClient.invalidateQueries({
        queryKey: ["satsRewardAddresses", user.id],
      });
      onClose();
      formik.resetForm();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
    },
  });

  const formik = useFormik({
    initialValues: {
      address: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required("Sats address is required"),
    }),
    onSubmit: (values) => {
      mutate({ userID: user.id, address: values.address });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-50 p-8 rounded-md">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Add Payout Address
        </h2>
        <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Wallet className="text-indigo-600 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-indigo-900">
              Lightning Address
            </p>
            <p className="text-xs text-indigo-700 mt-0.5">
              Enter your Lightning address (e.g., user@blink.sv) for rewards.
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
                "Save Address"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
