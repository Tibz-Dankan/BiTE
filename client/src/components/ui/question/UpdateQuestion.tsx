import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useAuthStore } from "../../../stores/auth";
import { useMutation } from "@tanstack/react-query";
import type { TQuestion, TUpdateQuestion } from "../../../types/question";
import { InputField } from "../shared/InputField";
import { Loader2 } from "lucide-react";
import { Button } from "../shared/Btn";
import { InputCheckbox } from "../shared/InputCheckbox";
import { questionAPI } from "../../../api/question";
import { useQuestionStore } from "../../../stores/question";

interface UpdateQuestionProps {
  question: TQuestion;
}

export const UpdateQuestion: React.FC<UpdateQuestionProps> = (props) => {
  const question = props.question;

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );
  const updateQuestion = useQuestionStore((state) => state.updateQuestion);

  const user = useAuthStore((state) => state.auth.user);

  const { isPending, mutate } = useMutation({
    mutationFn: questionAPI.update,
    onSuccess: async (response: any) => {
      updateQuestion(response.data);
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

  const initialValues: TUpdateQuestion = {
    id: question.id,
    title: question.title,
    postedByUserID: user.id,
    quizID: question.quizID,
    sequenceNumber: question.sequenceNumber,
    hasMultipleCorrectAnswers: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      sequenceNumber: Yup.number().required("Question number is required"),
      hasMultipleCorrectAnswers: Yup.boolean().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        mutate({
          id: values.id,
          title: values.title,
          postedByUserID: values.postedByUserID,
          quizID: values.quizID,
          sequenceNumber: values.sequenceNumber,
          hasMultipleCorrectAnswers: values.hasMultipleCorrectAnswers,
        });
      } catch (error: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        console.error(error);
      }
    },
  });

  return (
    <div
      className="w-full sm:max-w-140s flex flex-col items-center
       justify-center gap-8 mb-16"
    >
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
        {/* Title Input field */}
        <InputField
          name="title"
          label="Title"
          placeholder="Enter your quiz title"
          type="text"
          formik={formik}
          required={true}
        />

        {/* hasMultipleCorrectAnswers checkbox */}
        <InputCheckbox
          name="hasMultipleCorrectAnswers"
          label="This Question has multiple correct answers"
          formik={formik}
          checked={question.hasMultipleCorrectAnswers}
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
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
