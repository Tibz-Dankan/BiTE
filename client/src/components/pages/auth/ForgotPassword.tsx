import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import type { TForgotPassword } from "../../../types/auth";
import { useNotificationStore } from "../../../stores/notification";
import { InputField } from "../../ui/shared/InputField";
import { authAPI } from "../../../api/auth";
import { Button } from "../../ui/shared/Btn";

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );

  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const redirectUser = () => {
    navigate("/auth/verify-otp");
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: async (response: any) => {
      console.log("response:", response);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      redirectUser();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const initialValues: TForgotPassword = {
    email: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("Email is required"),
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
        <Link to="/" className="flex justify-center mb-8">
          <img
            src="/images/bite-logo.png"
            alt="BiTE Logo"
            width={100}
            height={100}
          />
        </Link>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-8">
          Forgot your password? initiate recovery
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email associated with your account"
            type="email"
            formik={formik}
            required={true}
          />
          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Remember password?{" "}
              <Link
                to="/auth/signin"
                className="font-medium text-gray-600 hover:text-blue-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
