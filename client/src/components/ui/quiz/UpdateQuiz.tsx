import React, { useState } from "react";
import type { TQuiz, TUpdateQuiz } from "../../../types/quiz";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { quizAPI } from "../../../api/quiz";
import { InputField } from "../shared/InputField";
import { Button } from "../shared/Btn";
import { Loader2 } from "lucide-react";
import { DatePicker } from "../shared/DatePicker";
import { AppDate } from "../../../utils/appDate";
import { InputTextArea } from "../shared/InputTextArea";

interface UpdateQuizProps {
  quiz: TQuiz;
}

export const UpdateQuiz: React.FC<UpdateQuizProps> = (props) => {
  const quiz = props.quiz;

  const [startTime, setStartTime] = useState(
    new AppDate(quiz.startsAt).time24hourFormat()
  );
  const [endTime, setEndTime] = useState(
    new AppDate(quiz.endsAt).time24hourFormat()
  );

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: quizAPI.update,
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

  const initialValues: TUpdateQuiz = {
    id: quiz.id,
    title: quiz.title,
    introduction: quiz.introduction,
    postedByUserID: quiz.postedByUserID,
    startsAt: quiz.startsAt,
    endsAt: quiz.endsAt,
    instructions: quiz.instructions,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Title is required"),
      instructions: Yup.string().optional(),
      introduction: Yup.string().optional(),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        const startsAt = new AppDate(values.startsAt).addTimeToDate(startTime);
        const endsAt = new AppDate(values.endsAt).addTimeToDate(endTime);
        console.log("startsAt: ", startsAt);
        console.log("endsAt: ", endsAt);

        mutate({
          id: values.id,
          title: values.title,
          introduction: values.introduction,
          postedByUserID: values.postedByUserID,
          startsAt: startsAt,
          endsAt: endsAt,
          instructions: values.instructions,
        });
      } catch (error: any) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
        console.error(error);
      }
    },
  });
  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <InputField
          name="title"
          label="Title"
          placeholder="Enter your quiz title"
          type="text"
          formik={formik}
          required={true}
        />
        <InputTextArea
          name="introduction"
          label="Intro"
          placeholder="Enter quiz introduction"
          formik={formik}
          required={false}
        />
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
                  transition-all focus:outline-none p-2 text-sm text-gray-700
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
        <div className="w-full flex items-center justify-center md:justify-end">
          <Button
            type="submit"
            className="w-full md:w-40 mt-4"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
