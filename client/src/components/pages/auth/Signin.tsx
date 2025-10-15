import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Auth, SigninInPut } from "../../../types/auth";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { InputField } from "../../ui/InputField";
import { authAPI } from "../../../api/auth";
import { Button } from "../../ui/Btn";

export const Signin: React.FC = () => {
  const navigate = useNavigate();
  const updateAuth = useAuthStore((state) => state.updateAuth);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );

  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const redirectUser = (auth: Auth) => {
    if (auth.user.role === "ADMIN") {
      navigate("/a/dashboard", { replace: true });
      return;
    }
    if (auth.user.role === "USER") {
      navigate("/u/dashboard", { replace: true });
      return;
    }
    navigate("/auth/login");
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authAPI.signIn,
    onSuccess: async (auth: Auth & { message: string }) => {
      console.log("Login successful:", auth);
      showCardNotification({ type: "success", message: auth.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      updateAuth(auth);
      redirectUser(auth);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const initialValues: SigninInPut = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("Email is required"),
      password: Yup.string()
        .max(255)
        .min(5)
        .max(30)
        .required("Password is required"),
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
          Sign In to Your Account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            formik={formik}
            required={true}
          />
          <InputField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            formik={formik}
            required={true}
          />
          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
