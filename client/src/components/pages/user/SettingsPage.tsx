import React, { useState } from "react";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../../api/auth";
import { InputField } from "../../ui/shared/InputField";
import { Button } from "../../ui/shared/Btn";
import {
  Loader2,
  Pencil,
  Paperclip,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal } from "../../ui/shared/Modal";
import { AlertCard } from "../../ui/shared/AlertCard";
import { FilePicker } from "../../ui/shared/FilePicker";

const UpdateUserAvatar: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.updateAuth);
  const profileImage = auth.user.attachments?.[0]?.url || auth.user.imageUrl;

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<ArrayBuffer>();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification,
  );

  const { isPending, mutate } = useMutation({
    mutationFn: authAPI.updateUserImage,
    onSuccess: async (response: any) => {
      // Assuming response contains the updated user or user.imageUrl
      updateAuth({ ...auth, user: response.data || auth.user });
      setShowImagePreview(() => false);
      setFile(() => null as any);
      showCardNotification({
        type: "success",
        message: response.message || "Avatar updated successfully",
      });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const uploadFileHandler = (file: any) => {
    const formData = new FormData();
    formData.append("file", new Blob([file]));

    mutate({
      userID: auth.user.id,
      formData: formData,
    });
  };

  const onSaveHandler = (file: any) => {
    setFileError(() => "");
    setShowImagePreview(() => true);
    setFile(() => file);
  };

  const onErrorHandler = (errorList: any) => {
    const error = errorList[0]?.reason.toLowerCase();
    setFileError(() => error);
    setShowImagePreview(() => false);
    setFile(() => null as any);
  };

  const closeImagePreviewHandler = () => {
    setShowImagePreview(() => false);
    setFile(() => undefined);
  };

  const getImageURL = (file: any) => {
    const blob = new Blob([file as ArrayBuffer], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="w-full">
      <Modal
        openModalElement={
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800">
              Avatar
            </label>
            <div className="relative w-20 h-20 group cursor-pointer">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-[1px] border-gray-300"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white font-medium shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor:
                      auth.user.profileBgColor || "var(--primary)",
                  }}
                >
                  {auth.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="text-white w-4 h-4 mb-1" />
                <span className="text-white text-[10px] font-medium">Edit</span>
              </div>
            </div>
          </div>
        }
      >
        <div className="w-[90vw] sm:w-[50vw] min-h-[50vh] max-h-[80vh] flex flex-col items-center justify-start p-8 space-y-8 bg-gray-50 rounded-md">
          {fileError && (
            <div className="w-full">
              <AlertCard type="error" message={fileError} />
            </div>
          )}

          {showImagePreview && file && (
            <div className="relative">
              <img
                src={getImageURL(file)}
                alt={"preview"}
                className="w-48 h-48 rounded-full object-cover shadow-md"
              />
              <span
                className="absolute top-2 right-2 bg-white/80 rounded-full p-2 cursor-pointer hover:text-(--primary) shadow-sm"
                onClick={() => closeImagePreviewHandler()}
              >
                <X className="w-4 h-4 text-gray-800 hover:text-inherit" />
              </span>
            </div>
          )}

          {!showImagePreview && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-8">
              <p className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="flex items-center gap-1">
                  <span>Update Profile Avatar</span>
                </span>
              </p>
              <FilePicker
                acceptableFileType={"image/*"}
                validFileTypeList={["png", "jpg", "jpeg", "webp"]}
                onSave={onSaveHandler}
                onError={onErrorHandler}
                className="bg-(--primary) rounded-md"
              >
                <span className="flex items-center justify-center px-4 py-2 bg-(--primary) rounded-md text-gray-100 gap-2 cursor-pointer hover:opacity-90 transition">
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                </span>
              </FilePicker>
            </div>
          )}

          {file && !fileError && (
            <div className="w-full flex items-center justify-center sm:justify-end">
              <Button
                type="button"
                onClick={() => uploadFileHandler(file)}
                className="w-full sm:w-40"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.updateAuth);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification,
  );

  const { isPending: isUpdatingUser, mutate: mutateUser } = useMutation({
    mutationFn: authAPI.updateUser,
    onSuccess: async (response: any) => {
      updateAuth({
        ...auth,
        user: response.data || { ...auth.user, ...formikProfile.values },
      });
      showCardNotification({
        type: "success",
        message: response.message || "Profile updated successfully",
      });
      setTimeout(() => hideCardNotification(), 5000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => hideCardNotification(), 7000);
    },
  });

  const { isPending: isUpdatingPassword, mutate: mutatePassword } = useMutation(
    {
      mutationFn: authAPI.changePassword,
      onSuccess: async (response: any) => {
        formikPassword.resetForm();
        showCardNotification({
          type: "success",
          message: response.message || "Password changed successfully",
        });
        setTimeout(() => hideCardNotification(), 5000);
      },
      onError: (error: any) => {
        showCardNotification({ type: "error", message: error.message });
        setTimeout(() => hideCardNotification(), 7000);
      },
    },
  );

  const formikProfile = useFormik({
    initialValues: {
      name: auth.user.name || "",
      email: auth.user.email || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .max(255)
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      mutateUser({
        ...auth.user,
        name: values.name,
        email: values.email,
      });
    },
    enableReinitialize: true,
  });

  const formikPassword = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(5)
        .max(30)
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
        .required("Confirm new password is required"),
    }),
    onSubmit: async (values) => {
      mutatePassword({
        userID: auth.user.id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });

  const [activeTab, setActiveTab] = useState("profile");

  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        Account settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-12">
          {/* Profile Section */}
          <section
            id="profile-section"
            className="bg-white border-[1px] border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-[1px] border-gray-100">
              Profile
            </h2>

            <div className="space-y-8">
              <UpdateUserAvatar />

              <form
                onSubmit={formikProfile.handleSubmit}
                className="space-y-6 max-w-2xl"
              >
                <InputField
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                  formik={formikProfile}
                  required={true}
                />

                <InputField
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  formik={formikProfile}
                  required={true}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={!formikProfile.dirty || isUpdatingUser}
                  >
                    {isUpdatingUser ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Updating Profile
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </section>

          {/* Account Security Section */}
          <section
            id="password-section"
            className="bg-white border-[1px] border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-[1px] border-gray-100">
              Change Password
            </h2>

            <form
              onSubmit={formikPassword.handleSubmit}
              className="space-y-6 max-w-2xl"
            >
              <InputField
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                type="password"
                formik={formikPassword}
                required={true}
              />
              <InputField
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                formik={formikPassword}
                required={true}
              />
              <InputField
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm new password"
                type="password"
                formik={formikPassword}
                required={true}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!formikPassword.dirty || isUpdatingPassword}
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                      Password
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Sidebar Menu */}
        <div className="hidden md:block md:col-span-1">
          <nav className="flex flex-col space-y-1 sticky top-8">
            <button
              type="button"
              onClick={() => scrollToSection("profile-section", "profile")}
              className={`text-left px-4 py-2 text-sm font-medium rounded-md border-l-4 transition-colors ${
                activeTab === "profile"
                  ? "text-(--primary) bg-(--primary)/10 border-(--primary)"
                  : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("password-section", "password")}
              className={`text-left px-4 py-2 text-sm font-medium rounded-md border-l-4 transition-colors ${
                activeTab === "password"
                  ? "text-(--primary) bg-(--primary)/10 border-(--primary)"
                  : "text-gray-600 border-transparent hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Change Password
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
