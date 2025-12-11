import React, { Fragment, useState, type ReactNode } from "react";
import { Checkbox } from "./checkbox";
import { AlertCircle } from "lucide-react";

interface InputCheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  formik?: any;
  name: string;
  label?: ReactNode;
  checked?: boolean;
  value?: string;
  onCheckedChange?: (checked: boolean, value?: string) => void;
}

export const InputCheckbox: React.FC<InputCheckboxProps> = (props) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "";
  const hasValueProvided = props.value !== undefined;
  const value = hasValueProvided ? props.value : "";
  const isChecked = props.checked !== undefined ? props.checked : false;
  const [checked, setChecked] = useState<boolean>(isChecked);

  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  const onCheckedChangeHandler = (checked: boolean) => {
    setChecked(() => checked);

    if (value && props.onCheckedChange !== undefined) {
      props.onCheckedChange(checked, value);
      return;
    }

    formik.values[`${name}`] = checked;
  };

  return (
    <Fragment>
      <div
        className="relative pb-5 flex flex-col items-start
        justify-center gap-1 w-full mb-1"
      >
        <div className="w-full flex items-center justify-start gap-2 relative">
          <Checkbox
            id={name}
            className="data-[state=checked]:border-(--primary)
             data-[state=checked]:bg-(--primary) data-[state=checked]:text-white
             cursor-pointer"
            checked={checked}
            onCheckedChange={onCheckedChangeHandler}
          />
          {label && (
            <label
              className={`text-sm first-letter:uppercase font-normal text-gray-700`}
            >
              {label}
            </label>
          )}
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
