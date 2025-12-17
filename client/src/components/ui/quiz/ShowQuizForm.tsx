import React from "react";
import { Button } from "../shared/Btn";
import { Loader2 } from "lucide-react";
import type { TQuiz } from "../../../types/quiz";
import { useFormik } from "formik";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";

interface ShowQuizFormProps {
  quiz: TQuiz;
  onSuccess: (succeeded: boolean) => void;
}

export const ShowQuizForm: React.FC<ShowQuizFormProps> = (props) => {
  const quiz = props.quiz;

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: quizAPI.showQuiz,
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

  const formik = useFormik({
    initialValues: {},
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
        <h2 className="text-gray-800 font-semibold">Show Quiz</h2>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Information text */}
        <div className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-700">
            Clicking the button below will make the quiz{" "}
            <strong>visible</strong> to students.
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
              "Show Quiz"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
