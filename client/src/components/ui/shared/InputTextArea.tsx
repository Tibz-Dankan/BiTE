import React, { Fragment, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  formik?: any;
  name: string;
  placeholder?: string;
  label?: ReactNode;
  required?: boolean;
}

export const InputTextArea: React.FC<InputTextAreaProps> = (props) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "";
  const isRequired = props.required ? props.required : false;
  const placeholder = props.placeholder ? props.placeholder : "";

  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  return (
    <Fragment>
      <div
        className="relative pb-5 flex flex-col items-start
        justify-center gap-1 w-full text-color-text-primary mb-1"
      >
        {label && (
          <label
            className={`text-sm first-letter:uppercase mb-1
             font-[450] text-gray-800`}
          >
            {label} {isRequired && <span className="text-red-700">*</span>}
          </label>
        )}
        <div className="w-full relative">
          <textarea
            id={name}
            required={isRequired}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[`${name}`]}
            placeholder={placeholder}
            className={twMerge(
              `p-2 outline-none rounded-md border-[1px]
              focus:border-(--primary) focus:ring-1 ring-(--primary) 
              transition-all text-sm w-full min-h-20 focus:outline-none text-gray-700
              ${hasError ? "border-red-500" : "border-gray-400"}`,
              props.className
            )}
          />
        </div>
        {hasError && (
          <p
            className="absolute bottom-0 left-0 text-sms text-red-500
             first-letter:uppercase text-[12px] flex gap-1"
          >
            <AlertCircle className="text-inherit w-4 h-4" />
            <span className="first-letter:uppercase">
              {formik.errors[`${name}`]}
            </span>
          </p>
        )}
      </div>
    </Fragment>
  );
};
