import React, { Fragment, type ReactNode, useEffect, useState } from "react";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { useGetQuizCategories } from "../../../hooks/useGetQuizCategories";
import type { TQuizCategory } from "../../../types/quizCategory";

interface InputSelectQuizCategoryProps {
  formik?: any;
  name: string;
  label?: ReactNode;
  required?: boolean;
  transparent?: boolean;
}

export const InputSelectQuizCategory: React.FC<InputSelectQuizCategoryProps> = (
  props
) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "Quiz Category";
  const required = props.required ? props.required : false;
  const transparent = props.transparent ? props.transparent : false;

  const { quizCategories, isLoading } = useGetQuizCategories();

  const [value, setValue] = useState<string>(formik.values[`${name}`] || "");

  const hasSelectedValue: boolean = !!formik.values[`${name}`];
  const hasCategories = isArrayWithElements(quizCategories);
  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  useEffect(() => {
    const setDefaultValueHandler = () => {
      if (hasSelectedValue) return;

      if (hasCategories) {
        const firstCategoryId = quizCategories[0].id;
        formik.values[`${name}`] = firstCategoryId;
        setValue(firstCategoryId);
      }
    };

    setDefaultValueHandler();

    return () => {};
  }, [hasSelectedValue, quizCategories, hasCategories, formik, name]);

  const formikOnChangeHandler = (value: string) => {
    console.log("selected value: ", value);
    formik.values[`${name}`] = value;
    setValue(() => value);
  };

  // Find selected category to display its name and color
  const selectedCategory = quizCategories.find(
    (category: TQuizCategory) => category.id === value
  );

  if (isLoading) {
    return (
      <div className="relative pb-5 flex flex-col items-start justify-center gap-1 w-full">
        <label className="text-sm first-letter:uppercase font-[450] text-gray-800">
          {label} {required && <span className=" text-red-700">*</span>}
        </label>
        <div className="w-full p-2 border border-gray-300 rounded-md text-gray-500">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div
        className={`relative pb-5 flex flex-col items-start
          justify-center gap-1 w-full`}
      >
        <label
          className={`text-sm first-letter:uppercase font-[450]
           ${hasError ? "text-red-400" : "text-gray-800"}`}
        >
          {label} {required && <span className=" text-red-700">*</span>}
        </label>
        <div className="w-full relative">
          <Select
            value={value}
            onValueChange={(value: string) => formikOnChangeHandler(value)}
          >
            <SelectTrigger
              className={`border-[1px] ${
                hasError ? "border-red-500" : "border-gray-300"
              } ${transparent ? "bg-transparent" : ""}`}
            >
              {hasCategories && selectedCategory && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
                    style={{ backgroundColor: selectedCategory.color }}
                  />
                  <span className="text-gray-700 font-medium">
                    {selectedCategory.name}
                  </span>
                </div>
              )}
            </SelectTrigger>
            <SelectContent className="z-[9999] bg-white">
              {quizCategories.map((category: TQuizCategory) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 py-1">
                    <div
                      className="w-6 h-6 rounded-md border border-gray-300 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-700 font-medium">
                      {category.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasError && (
          <p className="absolute -bottom-3 left-0 text-sm text-red-400">
            {formik.errors[`${name}`]}
          </p>
        )}
      </div>
    </Fragment>
  );
};
