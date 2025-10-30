import React, { useState } from "react";
import type { TPostQuiz, TQuiz } from "../../../types/quiz";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { quizAPI } from "../../../api/quiz";
import { InputField } from "../shared/InputField";
import { Button } from "../shared/Btn";
import { Loader2, Upload, X } from "lucide-react";
import { DatePicker } from "../shared/DatePicker";
import { AppDate } from "../../../utils/appDate";
import { useAuthStore } from "../../../stores/auth";
import { AlertCard } from "../shared/AlertCard";
import { FilePicker } from "../shared/FilePicker";
import { useNavigate } from "react-router-dom";
import { useRouteStore } from "../../../stores/routes";
import { QuizFormHeading } from "./PostQuizHeading";
import { InputTextArea } from "../shared/InputTextArea";

export const PostQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("23:00");

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<ArrayBuffer>();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const user = useAuthStore((state) => state.auth.user);
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const navigateToNewQuestionPage = (quiz: TQuiz) => {
    navigate(`/a/quizzes/${quiz.id}/questions/new`);
    updateCurrentPage({
      title: "New Question",
      icon: undefined,
      path: `/a/quizzes/${quiz.id}/questions/new`,
      showInSidebar: false,
      element: undefined,
    });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: quizAPI.post,
    onSuccess: async (response: any) => {
      console.log("response:", response);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      navigateToNewQuestionPage(response.data);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

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

  const initialValues: TPostQuiz = {
    title: "",
    introduction: "",
    postedByUserID: user.id,
    startsAt: "",
    endsAt: "",
    instructions: "",
    file: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      introduction: Yup.string().optional(),
      instructions: Yup.string().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        const startsAt = new AppDate(values.startsAt).addTimeToDate(startTime);
        const endsAt = new AppDate(values.endsAt).addTimeToDate(endTime);

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("introduction", values.introduction);
        formData.append("postedByUserID", values.postedByUserID);
        formData.append("startsAt", startsAt);
        formData.append("endsAt", endsAt);
        formData.append("instructions", values.instructions);
        formData.append("file", new Blob([file!]));

        mutate({ formData: formData });
      } catch (error: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        console.error(error);
      }
    },
  });
  return (
    <div
      className="w-full sm:max-w-140 flex flex-col items-center 
      justify-center gap-4 mb-16"
    >
      <QuizFormHeading />
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Title Input field */}
        <InputField
          name="title"
          label="Title"
          placeholder="Enter quiz title"
          type="text"
          formik={formik}
          required={true}
        />

        {/* Introduction field */}
        <InputTextArea
          name="introduction"
          label="Intro"
          placeholder="Enter quiz introduction"
          formik={formik}
          required={false}
        />

        {/* Image selector*/}
        <div className="w-full flex flex-col items-start bg-green-500s rounded-md">
          <label className="text-sm font-[450] text-gray-800 mb-2">
            Attachment(Image)
          </label>
          {fileError && (
            <div className="w-full">
              <AlertCard type="error" message={fileError} />
            </div>
          )}

          {showImagePreview && (
            <div
              className="w-full sm:w-1/2 min-h-32 flex items-center 
               justify-center gap-2 relative border-[1px] border-gray-300
               rounded-md"
            >
              <img
                src={getImageURL(file)}
                alt={"preview"}
                className="object-cover object-center rounded-md"
              />
              <span
                className="absolute top-2 right-2 bg-gray-50/80 rounded-full p-2
                cursor-pointer hover:text-(--primary) shadow-sm"
                onClick={() => closeImagePreviewHandler()}
              >
                <X className="w-4 h-4 text-gray-800 hover:text-inherit" />
              </span>
            </div>
          )}

          {!showImagePreview && (
            <div
              className="w-full sm:w-1/2 h-full flex flex-col justify-center
              items-start"
            >
              <FilePicker
                acceptableFileType={"image/*"}
                validFileTypeList={["png", "jpg", "jpeg", "webp"]}
                onSave={onSaveHandler}
                onError={onErrorHandler}
                className="w-full aspect-[4/2] lg:aspect-[4/1] border-[1px] border-dashed
                 border-gray-400 rounded-md cursor-pointer"
              >
                <span
                  className="w-full flex items-center justify-center px-4 py-2 bg-primary
                  rounded-md text-gray-700 gap-2 hover:text-(--primary)"
                >
                  <Upload className="w-4 h-4 hover:text-inherit" />
                  <span className="hover:text-inherit text-sm">
                    Choose File
                  </span>
                </span>
              </FilePicker>
            </div>
          )}
        </div>

        {/* Instructions input field */}
        <InputField
          name="instructions"
          label="Instructions"
          placeholder="Enter your instructions"
          type="text"
          formik={formik}
          required={true}
        />
        <div
          className="w-full flex flex-col sm:flex-row items-center justify-center 
          gap-4"
        >
          {/* Starts At */}
          <div className="w-full">
            <h3 className="text-gray-500 text-[12px]">Starts At</h3>
            <div className="flex flex-col justify-center gap-2">
              <div>
                <label className="text-sm text-gray-800">Date</label>
                <DatePicker name={"startsAt"} formik={formik} />
              </div>
              <div>
                <label className="text-sm text-gray-800">Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(() => event.target.value)}
                  className="w-full rounded-md border-[1px] border-gray-400
                  focus:border-(--primary) focus:ring-1 ring-(--primary) 
                  transition-all  focus:outline-none p-2 text-sm text-gray-700
                  self-start"
                />
              </div>
            </div>
          </div>

          {/* Ends At */}
          <div className="w-full">
            <h3 className="text-gray-500 text-[12px]">Ends At</h3>
            <div className="flex flex-col justify-center gap-2">
              <div>
                <label className="text-sm text-gray-800">Date</label>
                <DatePicker name={"endsAt"} formik={formik} />
              </div>
              <div>
                <label className="text-sm text-gray-800">Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(() => event.target.value)}
                  className="w-full rounded-md border-[1px] border-gray-400
                   focus:border-(--primary) focus:ring-1 ring-(--primary) 
                   transition-all  focus:outline-none p-2 text-sm text-gray-700
                   self-start"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center lg:justify-end">
          <Button
            type="submit"
            className="w-full lg:w-40 mt-4"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
