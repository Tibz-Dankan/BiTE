import React from "react";
import { Button } from "../shared/Btn";
import { Loader2 } from "lucide-react";
import { InputCheckbox } from "../shared/InputCheckbox";
import { InputField } from "../shared/InputField";
import type { TAnswer, TUpdateAnswer } from "../../../types/answer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { answerAPI } from "../../../api/answer";
import { useQuestionStore } from "../../../stores/question";

interface UpdateAnswerProps {
  answer: TAnswer;
  onSuccess: (succeeded: boolean) => void;
}

export const UpdateAnswer: React.FC<UpdateAnswerProps> = (props) => {
  const answer = props.answer;

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );
  const updateQuestionAnswer = useQuestionStore(
    (state) => state.updateQuestionAnswer
  );

  const { isPending, mutate } = useMutation({
    mutationFn: answerAPI.update,
    onSuccess: async (response: any) => {
      updateQuestionAnswer(response.data);
      props.onSuccess(true);
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

  const initialValues: TUpdateAnswer = {
    id: answer.id,
    title: answer.title,
    postedByUserID: answer.postedByUserID,
    questionID: answer.questionID,
    sequenceNumber: answer.sequenceNumber,
    isCorrect: answer.isCorrect,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      sequenceNumber: Yup.number().required(),
      isCorrect: Yup.boolean().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        mutate({
          id: values.id,
          title: values.title,
          postedByUserID: values.postedByUserID,
          questionID: values.questionID,
          sequenceNumber: values.sequenceNumber,
          isCorrect: values.isCorrect,
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
      className="w-full h-full flex flex-col items-center
       justify-start gap-4 mb-8"
    >
      <div className="w-full">
        <h2 className="text-gray-800 font-semibold">
          Edit Answer {answer.sequenceNumber}
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

        {/* Is correct answer checkbox */}
        <InputCheckbox
          name="isCorrect"
          label="This answer is correct"
          formik={formik}
          checked={answer.isCorrect}
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
