import React from "react";
import { Button } from "../shared/Btn";
import { Loader2 } from "lucide-react";
import { InputCheckbox } from "../shared/InputCheckbox";
import type { TQuiz } from "../../../types/quiz";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";

interface UpdateQuizAttemptFormProps {
  quiz: TQuiz;
  onSuccess: (succeeded: boolean) => void;
}

export const UpdateQuizAttemptForm: React.FC<UpdateQuizAttemptFormProps> = (
  props
) => {
  const quiz = props.quiz;

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: quiz.canBeAttempted
      ? quizAPI.makeQuizUnattemptable
      : quizAPI.makeQuizAttemptable,
    onSuccess: async (response: any) => {
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

  const initialValues = {
    canBeAttempted: quiz.canBeAttempted,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      canBeAttempted: Yup.boolean().optional(),
    }),

    onSubmit: async (_values: any, helpers: any) => {
      try {
        mutate({ quizID: quiz.id });
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
          Quiz Attemptability Settings
        </h2>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Quiz attemptability checkbox */}
        <div className="w-full mt-14 sm:mt-0 md:mt-14 lg:mt-0">
          <InputCheckbox
            name="canBeAttempted"
            label="This Quiz Can Be Attempted"
            formik={formik}
            checked={quiz.canBeAttempted}
          />
        </div>

        {/* Information text */}
        <div className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700">
            {quiz.canBeAttempted ? (
              <>
                This quiz is currently <strong>attemptable</strong>. Students
                can take this quiz. Uncheck the box above to make it
                unattemptable.
              </>
            ) : (
              <>
                This quiz is currently <strong>not attemptable</strong>.
                Students cannot take this quiz. Check the box above to make it
                attemptable.
              </>
            )}
          </p>
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
