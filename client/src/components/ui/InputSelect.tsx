import React, { Fragment, type ReactNode, useEffect, useState } from "react";
import { isArrayWithElements } from "../../utils/isArrayWithElements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface InputSelectProps {
  formik?: any;
  name: string;
  defaultOption?: string;
  options: string[];
  label?: ReactNode;
  required?: boolean;
  transparent?: boolean;
}

export const InputSelect: React.FC<InputSelectProps> = (props) => {
  const formik = props.formik;
  const options = props.options;
  const name = props.name;
  const label = props.label ? props.label : "";
  const hasDefaultOption: boolean = !!props.defaultOption;
  const defaultOption = hasDefaultOption ? props.defaultOption : "";
  const required = props.required ? props.required : false;
  const transparent = props.transparent ? props.transparent : false;

  const [value, setValue] = useState<any>(formik.values[`${name}`]);

  const hasSelectedValue: boolean = !!formik.values[`${name}`];
  const hasOptions = isArrayWithElements(options);
  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  useEffect(() => {
    const setDefaultValueHandler = () => {
      if (hasSelectedValue) return;

      if (hasDefaultOption) {
        formik.values[`${name}`] = defaultOption!;
        return;
      }

      formik.values[`${name}`] = options[0];
    };

    setDefaultValueHandler();

    return () => {};
  }, [
    hasSelectedValue,
    options,
    hasDefaultOption,
    defaultOption,
    formik,
    name,
  ]);

  const formikOnChangeHandler = (value: any) => {
    formik.values[`${name}`] = value;
    setValue(() => value);
  };

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
            onValueChange={(value: any) => formikOnChangeHandler(value)}
          >
            <SelectTrigger
              className={`border-[1px] ${
                hasError ? "border-red-500" : "border-gray-300"
              } ${transparent ? "bg-transparent" : ""}`}
            >
              {hasOptions && (
                <SelectValue
                  placeholder={options[0]}
                  className="text-gray-600"
                />
              )}
            </SelectTrigger>
            <SelectContent className={``}>
              {options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                  className="hover:bg-white"
                >
                  {option}
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
