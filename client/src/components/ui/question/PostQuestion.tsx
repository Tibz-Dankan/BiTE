import React, { useState } from "react";
import type { TQuiz } from "../../../types/quiz";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useAuthStore } from "../../../stores/auth";
import { useMutation } from "@tanstack/react-query";
import type { TPostQuestion } from "../../../types/question";
import { InputField } from "../shared/InputField";
import { AlertCard } from "../shared/AlertCard";
import { FilePicker } from "../shared/FilePicker";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "../shared/Btn";
import { InputCheckbox } from "../shared/InputCheckbox";
import { questionAPI } from "../../../api/question";
import { PostQuestionHeading } from "./PostQuestionHeading";
// import { InputTextArea } from "../shared/InputTextArea";
import { useNavigate } from "react-router-dom";
import { useRouteStore } from "../../../stores/routes";
import { QuillEditor } from "../shared/QuillEditor";

interface PostQuestionProps {
  quiz: TQuiz;
}

export const PostQuestion: React.FC<PostQuestionProps> = (props) => {
  const quiz = props.quiz;

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<ArrayBuffer>();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const user = useAuthStore((state) => state.auth.user);

  const navigateToQuizQuestionPage = (quiz: TQuiz) => {
    navigate(`/a/quizzes/${quiz.id}/questions`);
    updateCurrentPage({
      title: "New Question",
      icon: undefined,
      path: `/a/quizzes/${quiz.id}/questions`,
      showInSidebar: false,
      element: undefined,
    });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: questionAPI.post,
    onSuccess: async (response: any) => {
      console.log("response:", response);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      navigateToQuizQuestionPage(quiz);
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

  const initialValues: TPostQuestion = {
    title: "",
    titleDelta: "",
    titleHTML: "",
    introduction: "",
    introductionDelta: "",
    introductionHTML: "",
    postedByUserID: user.id,
    quizID: quiz.id,
    sequenceNumber: 0,
    hasMultipleCorrectAnswers: false,
    file: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      introduction: Yup.string().optional(),
      sequenceNumber: Yup.number().required(),
      hasMultipleCorrectAnswers: Yup.boolean().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("titleDelta", values.titleDelta);
        formData.append("titleHTML", values.titleHTML);
        formData.append("introduction", values.introduction);
        formData.append("introductionDelta", values.introductionDelta);
        formData.append("introductionHTML", values.introductionHTML);
        formData.append("postedByUserID", values.postedByUserID);
        formData.append("quizID", values.quizID);
        formData.append("sequenceNumber", values.sequenceNumber);
        formData.append(
          "hasMultipleCorrectAnswers",
          values.hasMultipleCorrectAnswers
        );
        if (file) {
          formData.append("file", new Blob([file!]));
        }

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
       justify-center gap-8 mb-16"
    >
      <PostQuestionHeading quizTitleDelta={quiz.titleDelta} />
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Question number (sequence number) input field */}
        <InputField
          name="sequenceNumber"
          label="Question number"
          placeholder="Enter question number"
          type="number"
          formik={formik}
          required={true}
        />

        {/* Title field */}
        <QuillEditor
          label="Title"
          placeholder="Enter quiz title"
          onChange={(values) => {
            formik.values["title"] = values.plainText;
            formik.values["titleDelta"] = values.deltaContent;
            formik.values["titleHTML"] = values.htmlContent;
          }}
        />

        {/* Introduction field */}
        <QuillEditor
          label="Intro"
          placeholder="Enter quiz introduction"
          onChange={(values) => {
            formik.values["introduction"] = values.plainText;
            formik.values["introductionDelta"] = values.deltaContent;
            formik.values["introductionHTML"] = values.htmlContent;
          }}
        />

        {/* Image selector*/}
        <div className="w-full flex flex-col items-start gap-2 rounded-md">
          <label className="text-sm font-[450] text-gray-800">
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

        {/* hasMultipleCorrectAnswers checkbox */}
        <InputCheckbox
          name="hasMultipleCorrectAnswers"
          label="This Question has multiple correct answers"
          formik={formik}
          checked={false}
        />

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
