import React, { useState } from "react";
import { Button } from "../shared/Btn";
import { Loader2, Upload, X } from "lucide-react";
import { InputCheckbox } from "../shared/InputCheckbox";
import { FilePicker } from "../shared/FilePicker";
import { AlertCard } from "../shared/AlertCard";
import { InputField } from "../shared/InputField";
import type { TPostAnswer } from "../../../types/answer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useAuthStore } from "../../../stores/auth";
import { useMutation } from "@tanstack/react-query";
import { answerAPI } from "../../../api/answer";
import type { TQuestion } from "../../../types/question";

interface PostAnswerProps {
  question: TQuestion;
}

export const PostAnswer: React.FC<PostAnswerProps> = (props) => {
  console.log("props.question: ", props.question);
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

  const { isPending, mutate } = useMutation({
    mutationFn: answerAPI.post,
    onSuccess: async (response: any) => {
      console.log("response:", response);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
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

  const initialValues: TPostAnswer = {
    title: "",
    postedByUserID: user.id,
    questionID: props.question.id,
    sequenceNumber: 0,
    isCorrect: false,
    file: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      sequenceNumber: Yup.number().required(),
      hasMultipleCorrectAnswers: Yup.boolean().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("postedByUserID", values.postedByUserID);
        formData.append("questionID", values.questionID);
        formData.append("sequenceNumber", values.sequenceNumber);
        formData.append("isCorrect", values.isCorrect);
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
      className="w-full h-full sm:max-w-140 flex flex-col items-center
       justify-start gap-4 mb-8"
    >
      <div className="w-full">
        <h2 className="text-gray-800 font-semibold">
          Add Answer for Question {props.question.sequenceNumber}
        </h2>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Answer number (sequence number) input field */}
        <InputField
          name="sequenceNumber"
          label="Answer number"
          placeholder="Enter answer number"
          type="number"
          formik={formik}
          required={true}
        />
        {/* Title Input field */}
        <InputField
          name="title"
          label="Title"
          placeholder="Enter your answer title"
          type="text"
          formik={formik}
          required={true}
        />

        {/* Image selector*/}
        <div className="w-full flex flex-col items-start rounded-md">
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

        {/* Is correct answer checkbox */}
        <InputCheckbox
          name="isCorrect"
          label="This answer is correct"
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
