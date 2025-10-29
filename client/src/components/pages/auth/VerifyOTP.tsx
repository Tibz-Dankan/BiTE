import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { TVerifyOTP } from "../../../types/auth";
import { useNotificationStore } from "../../../stores/notification";
import { InputField } from "../../ui/shared/InputField";
import { authAPI } from "../../../api/auth";
import { Button } from "../../ui/shared/Btn";

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );

  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const redirectUser = (response: any) => {
    navigate(`/auth/reset-password?otp=${response.otp?.otp}`);
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authAPI.verifyOTP,
    onSuccess: async (response: any) => {
      console.log("response:", response);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      redirectUser(response);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const initialValues: TVerifyOTP = {
    otp: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      otp: Yup.string().max(255).required("OTP is required"),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        mutate(values);
      } catch (error: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        console.error(error);
      }
    },
  });

  return (
    <div
      className="min-w-[100vw] min-h-[100vh] flex flex-1 items-center
      justify-center p-4"
    >
      <div
        className="w-full max-w-md px-8 py-10 bg-white rounded-lg
        shadow-sm"
      >
        <div className="flex justify-center mb-8">
          <img
            src="/images/bite-logo.png"
            alt="BiTE Logo"
            width={100}
            height={100}
          />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-8">
          Verify One Time Passcode(OTP)
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField
            name="otp"
            label="OTP"
            placeholder="Enter otp"
            type="text"
            formik={formik}
            required={true}
          />
          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
