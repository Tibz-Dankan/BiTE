import React, { Fragment } from "react";
import { AlertCircle } from "lucide-react";
import type { TInputRadioOption } from "../../../types/input";
import { RadioGroup, RadioGroupItem } from "../shared/radio-group";

interface AnswerInputRadioProps extends React.HTMLAttributes<HTMLInputElement> {
  formik: any;
  name: string;
  options: TInputRadioOption[];
}

export const AnswerInputRadio: React.FC<AnswerInputRadioProps> = (props) => {
  const formik = props.formik;
  const name = props.name;
  const options = props.options;

  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  const onCheckedChangeHandler = (value: string) => {
    const answerIDList = [];
    answerIDList.push(value);
    formik.setFieldValue(name, answerIDList);
  };

  return (
    <Fragment>
      <RadioGroup>
        <div
          className="relative pb-5 flex flex-col items-start
          justify-center gap-6 w-full mb-1"
        >
          {options.map((option) => (
            <div
              key={option.name}
              className="w-full flex items-center justify-start gap-2 relative"
            >
              <RadioGroupItem
                id={option.name}
                value={option.value}
                className="border-(--primary) text-(--primary)
                  data-[state=checked]:border-(--primary)
                  data-[state=checked]:bg-(--primary) 
                  cursor-pointer"
                onClick={() => onCheckedChangeHandler(option.value)}
              />
              {option.label && (
                <label
                  htmlFor={option.name}
                  className={`text-sm first-letter:uppercase font-normal text-gray-700 cursor-pointer`}
                >
                  {option.label}
                </label>
              )}
            </div>
          ))}
          {hasError && (
            <p
              className="absolute -bottom-6 left-0 text-sms text-red-500
              first-letter:uppercase text-[12px] flex gap-1"
            >
              <AlertCircle className="text-inherit w-4 h-4" />
              <span className="first-letter:uppercase">
                {formik.errors[`${name}`]}
              </span>
            </p>
          )}
        </div>
      </RadioGroup>
    </Fragment>
  );
};
