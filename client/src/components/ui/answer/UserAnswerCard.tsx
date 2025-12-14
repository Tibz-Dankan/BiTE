import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import type { TQuestion } from "../../../types/question";
import type { TAnswer } from "../../../types/answer";
import type { TPostAttempt, TQuizAttemptData } from "../../../types/attempt";
import { InputField } from "../shared/InputField";
import { Button } from "../shared/Btn";
import { attemptAPI } from "../../../api/attempt";
import { useAuthStore } from "../../../stores/auth";
import { useNotificationStore } from "../../../stores/notification";
import type { TInputRadioOption } from "../../../types/input";
import { AnswerItemCard } from "./AnswerItemCard";
import { InputCheckbox } from "../shared/InputCheckbox";
import { AnswerInputRadio } from "./AnswerInputRadio";

interface UserAnswerCardProps {
  question: TQuestion;
  quizID: string;
  pagination: TQuizAttemptData["pagination"];
  onQuizCompleted?: (completed: boolean) => void;
}

export const UserAnswerCard: React.FC<UserAnswerCardProps> = ({
  question,
  quizID,
  pagination,
  onQuizCompleted,
}) => {
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const answers = question.answers || [];
  const requiresNumericalAnswer = question.requiresNumericalAnswer;
  const hasMultipleCorrectAnswers = question.hasMultipleCorrectAnswers;

  // Submit attempt mutation
  const { mutate: submitAttempt, isPending: isSubmitting } = useMutation({
    mutationFn: attemptAPI.post,
    onSuccess: (response) => {
      showCardNotification({
        type: "success",
        message: response.message,
      });
      setTimeout(() => hideCardNotification(), 3000);

      // Navigate to next question if available
      if (pagination?.hasNextItems) {
        const nextCursor = pagination.nextCursor;
        navigate(`/u/quizzes/${quizID}/attempt?limit=1&cursor=${nextCursor}`, {
          replace: true,
        });
      } else {
        onQuizCompleted?.(true);
      }
    },
    onError: (error: any) => {
      showCardNotification({
        type: "error",
        message: error.message,
      });
      setTimeout(() => hideCardNotification(), 5000);
    },
  });

  const answerIDListIndexOne = answers
    .filter((_, index) => index === 0)
    .map((answer) => answer.id);

  const initialValues: TPostAttempt = {
    userID: auth.user.id,
    questionID: question.id,
    answerIDList: requiresNumericalAnswer ? answerIDListIndexOne : [],
    answerInput: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      answerInput: requiresNumericalAnswer
        ? Yup.string().required("Answer is required")
        : Yup.string(),
      answerIDList: Yup.array().required("Please select an answer"),
    }),
    onSubmit: async (values) => {
      if (!values?.userID || !values?.questionID) return;

      submitAttempt({
        userID: values.userID,
        questionID: values.questionID,
        answerIDList: values.answerIDList,
        answerInput: values.answerInput.toString(),
      });
    },
  });

  const checkboxAnswerChangeHandler = (checked: boolean, value?: string) => {
    const answerIDList = formik.values.answerIDList;

    if (checked) {
      const alreadyInList = !!answerIDList.find((id) => id === value);
      if (!alreadyInList) {
        answerIDList.push(value!);
      }
    }
    if (!checked) {
      const alreadyInList = !!answerIDList.find((id) => id === value);
      if (alreadyInList) {
        answerIDList.splice(answerIDList.indexOf(value!), 1);
      }
    }
    formik.setFieldValue("answerIDList", answerIDList);
  };

  const showTextInput = requiresNumericalAnswer;
  const showCheckBoxInput =
    hasMultipleCorrectAnswers && !requiresNumericalAnswer;
  const showRadioInput = !hasMultipleCorrectAnswers && !requiresNumericalAnswer;

  const getAnswerOptions = (answers: TAnswer[]): TInputRadioOption[] => {
    return answers.map((answer) => {
      return {
        name: answer.id,
        label: <AnswerItemCard answer={answer} />,
        value: answer.id,
      };
    });
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
      <div className="w-full flex items-center justify-center gap-4">
        <div
          className="w-full flex flex-col sm:flex-row sm:items-center 
            sm:justify-center gap-2 sm:gap-4"
        >
          <div className="w-full">
            {showTextInput && (
              <InputField
                formik={formik}
                name="answerInput"
                type="number"
                label="Enter your answer"
                placeholder="Type your numerical answer here"
                required={true}
              />
            )}
            {showCheckBoxInput && (
              <div className="w-full flex flex-col items-centers gap-2">
                {answers.map((answer) => (
                  <div key={answer.id}>
                    <InputCheckbox
                      formik={formik}
                      name={"answerIDList"}
                      label={<AnswerItemCard answer={answer} />}
                      value={answer.id}
                      onCheckedChange={checkboxAnswerChangeHandler}
                    />
                  </div>
                ))}
              </div>
            )}
            {showRadioInput && (
              <AnswerInputRadio
                formik={formik}
                name="answerIDList"
                options={getAnswerOptions(answers)}
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-40">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
// };
