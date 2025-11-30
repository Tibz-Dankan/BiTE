import React from "react";
import { Button } from "../shared/Btn";
import { Loader2 } from "lucide-react";
import { InputField } from "../shared/InputField";
import { CategoryColorSelect } from "../shared/CategoryColorSelect";
import type { TQuizCategory, TUpdateQuizCategory } from "../../../types/quizCategory";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { quizCategoryAPI } from "../../../api/quizCategory";

interface UpdateQuizCategoryFormProps {
  quizCategory: TQuizCategory;
  onSuccess: (succeeded: boolean) => void;
}

export const UpdateQuizCategoryForm: React.FC<UpdateQuizCategoryFormProps> = (props) => {
  const quizCategory = props.quizCategory;

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: quizCategoryAPI.update,
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

  const initialValues: TUpdateQuizCategory = {
    id: quizCategory.id,
    name: quizCategory.name,
    color: quizCategory.color,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Category name is required"),
      color: Yup.string().required("Color is required"),
    }),

    onSubmit: async (values: any, helpers: any) => {
      try {
        mutate({
          id: values.id,
          name: values.name,
          color: values.color,
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
          Edit Quiz Category
        </h2>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Category name input field */}
        <InputField
          name="name"
          label="Category Name"
          placeholder="Enter category name"
          type="text"
          formik={formik}
          required={true}
        />

        {/* Color selector */}
        <CategoryColorSelect
          name="color"
          label="Category Color"
          formik={formik}
          required={true}
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

