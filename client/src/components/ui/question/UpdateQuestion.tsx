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
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { QuillEditor } from "../shared/QuillEditor";
import { isJSON } from "../../../utils/isJson";
import { useNavigate } from "react-router-dom";
import { useRouteStore } from "../../../stores/routes";

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
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const user = useAuthStore((state) => state.auth.user);

  const navigateToQuizQuestionPage = (question: TQuestion) => {
    navigate(`/a/quizzes/${question.quizID}/questions`);
    updateCurrentPage({
      title: "New Question",
      icon: undefined,
      path: `/a/quizzes/${question.quizID}/questions`,
      showInSidebar: false,
      element: undefined,
    });
  };

  const { isPending, mutate } = useMutation({
    mutationFn: questionAPI.update,
    onSuccess: async (response: any) => {
      updateQuestion(response.data);
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      navigateToQuizQuestionPage(response.data);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const titleDelta = question.isDeltaDefault
    ? isJSON(question.titleDelta!)
      ? question.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(question.title))
    : JSON.stringify(convertPlainTextToDelta(question.title));

  const introductionDelta = question.isDeltaDefault
    ? isJSON(question.introductionDelta!)
      ? question.introductionDelta!
      : JSON.stringify(convertPlainTextToDelta(question.introduction))
    : JSON.stringify(convertPlainTextToDelta(question.introduction));

  const initialValues: TUpdateQuestion = {
    id: question.id,
    title: question.title,
    titleDelta: titleDelta,
    titleHTML: question.titleHTML,
    introduction: question.introduction,
    introductionDelta: introductionDelta,
    introductionHTML: question.introductionHTML,
    postedByUserID: user.id,
    quizID: question.quizID,
    sequenceNumber: question.sequenceNumber,
    hasMultipleCorrectAnswers: question.hasMultipleCorrectAnswers,
    requiresNumericalAnswer: question.requiresNumericalAnswer,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      introduction: Yup.string().optional(),
      sequenceNumber: Yup.number().required("Question number is required"),
      hasMultipleCorrectAnswers: Yup.boolean().optional(),
      requiresNumericalAnswer: Yup.boolean().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        mutate({
          id: values.id,
          title: values.title,
          titleDelta: values.titleDelta,
          titleHTML: values.titleHTML,
          introduction: values.introduction,
          introductionDelta: values.introductionDelta,
          introductionHTML: values.introductionHTML,
          postedByUserID: values.postedByUserID,
          quizID: values.quizID,
          sequenceNumber: values.sequenceNumber,
          hasMultipleCorrectAnswers: values.hasMultipleCorrectAnswers,
          requiresNumericalAnswer: values.requiresNumericalAnswer,
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
        <QuillEditor
          label="Title"
          placeholder="Enter quiz title"
          onChange={(values) => {
            formik.values["title"] = values.plainText;
            formik.values["titleDelta"] = values.deltaContent;
            formik.values["titleHTML"] = values.htmlContent;
          }}
          defaultDelta={titleDelta}
        />

        {/* Introduction Input field */}
        <QuillEditor
          label="Intro"
          placeholder="Enter quiz introduction"
          onChange={(values) => {
            formik.values["introduction"] = values.plainText;
            formik.values["introductionDelta"] = values.deltaContent;
            formik.values["introductionHTML"] = values.htmlContent;
          }}
          defaultDelta={introductionDelta}
        />

        {/* hasMultipleCorrectAnswers checkbox */}
        <InputCheckbox
          name="hasMultipleCorrectAnswers"
          label="This Question has multiple correct answers"
          formik={formik}
          checked={question.hasMultipleCorrectAnswers}
        />

        {/* requiresNumericalAnswer checkbox */}
        <InputCheckbox
          name="requiresNumericalAnswer"
          label="This Question requires a numerical answer"
          formik={formik}
          checked={question.requiresNumericalAnswer}
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
