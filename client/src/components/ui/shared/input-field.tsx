import React, { Fragment, ReactNode, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface InputFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  formik?: any;
  name: string;
  type: "text" | "password" | "email" | "number" | "date" | "time";
  placeholder?: string;
  label?: ReactNode;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "";
  const required = props.required ? props.required : false;
  const placeholder = props.placeholder ? props.placeholder : "";

  const isPasswordField: boolean = props.type === "password";
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const showPasswordHandler = () => setShowPassword(() => !showPassword);

  const getFieldType = (): string => {
    if (isPasswordField && showPassword) return "text";
    return props.type;
  };

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
            {label} {required && <span className=" text-red-700">*</span>}
          </label>
        )}
        <div className="w-full relative">
          <input
            type={getFieldType()}
            id={name}
            required
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values[`${name}`]}
            placeholder={placeholder}
            className={`p-2 outline-none rounded-md border-[1px]
            focus:border-[1px] focus:border-primary
            transition-all text-sm w-full focus:outline-none
            text-color-text-primary bg-color-bg-primary ${
              hasError ? "border-red-500" : "border-color-border-primary"
            }`}
          />

          {isPasswordField && (
            <div className="inline-block absolute right-2 top-[7px]">
              {!showPassword && (
                <span
                  className="cursor-pointer"
                  onClick={() => showPasswordHandler()}
                >
                  <Eye className="text-[#868e96]" />
                </span>
              )}
              {showPassword && (
                <span
                  className="cursor-pointer"
                  onClick={() => showPasswordHandler()}
                >
                  <EyeOff className="text-[#868e96]" />
                </span>
              )}
            </div>
          )}
        </div>
        {hasError && (
          <p
            className="absolute bottom-0 left-0 text-sms text-red-500
             first-letter:uppercase text-[12px] flex items-center gap-1"
          >
            <AlertCircle className="text-inherit w-4 h-4" />
            <span>{formik.errors[`${name}`]}</span>
          </p>
        )}
      </div>
    </Fragment>
  );
};
