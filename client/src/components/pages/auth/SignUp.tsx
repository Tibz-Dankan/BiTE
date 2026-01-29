import React from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import type { TAuth, TSignUpInPut } from "../../../types/auth";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { InputField } from "../../ui/shared/InputField";
import { authAPI } from "../../../api/auth";
import { Button } from "../../ui/shared/Btn";
import { InputCheckbox } from "../../ui/shared/InputCheckbox";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const updateAuth = useAuthStore((state) => state.updateAuth);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );

  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const redirectUser = (auth: TAuth) => {
    if (auth.user.role === "ADMIN") {
      navigate("/a/dashboard", { replace: true });
      return;
    }
    if (auth.user.role === "USER") {
      navigate("/u/dashboard", { replace: true });
      return;
    }
    navigate("/auth/signin");
  };

  const { isPending, mutate } = useMutation({
    mutationFn: authAPI.signUp,
    onSuccess: async (auth: TAuth & { message: string }) => {
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

  const initialValues: TSignUpInPut = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedTermsOfService: true,
    agreedNewsLetterOrMarketingEmails: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Username is required"),
      email: Yup.string().max(255).required("Email is required"),
      password: Yup.string()
        .max(255)
        .min(5)
        .max(30)
        .required("Password is required"),
      confirmPassword: Yup.string()
        .max(255)
        .min(5)
        .max(30)
        .required("Confirm Password is required"),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        if (values.password !== values.confirmPassword) {
          showCardNotification({
            type: "error",
            message: "Password and Confirm Password don't match!",
          });
          return;
        }

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
      justify-center px-4 py-16"
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
          Sign up for an account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField
            name="name"
            label="Username"
            placeholder="Enter your fullname"
            type="text"
            formik={formik}
            required={true}
          />
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
          <InputField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Enter your confirm password"
            type="password"
            formik={formik}
            required={true}
          />

          <InputCheckbox
            name="agreedNewsLetterOrMarketingEmails"
            label="Receive occasional Newsletter or Marketing emails"
            formik={formik}
            checked={false}
          />
          <div>
            <p className="text-sm text-gray-600">
              <span>By signing up for an account you agree to our</span>{" "}
              <span className="text-blue-500s font-bold">
                <Link to={"/terms-of-service"}>Terms of Service</Link>
              </span>
            </p>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
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
