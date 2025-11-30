import React, { Fragment, type ReactNode, useEffect, useState } from "react";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Predefined color options with names and hex values
export const CATEGORY_COLORS = [
  { name: "Blue", hex: "#3B82F6" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Green", hex: "#10B981" },
  { name: "Emerald", hex: "#059669" },
  { name: "Orange", hex: "#F97316" },
  { name: "Red", hex: "#EF4444" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Violet", hex: "#8B5CF6" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Lime", hex: "#84CC16" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Sky", hex: "#0EA5E9" },
  { name: "Fuchsia", hex: "#D946EF" },
  { name: "Rose", hex: "#F43F5E" },
  { name: "Slate", hex: "#64748B" },
];

interface CategoryColorSelectProps {
  formik?: any;
  name: string;
  label?: ReactNode;
  required?: boolean;
  transparent?: boolean;
}

export const CategoryColorSelect: React.FC<CategoryColorSelectProps> = (
  props
) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "Category Color";
  const required = props.required ? props.required : false;
  const transparent = props.transparent ? props.transparent : false;

  const [value, setValue] = useState<string>(formik.values[`${name}`]);

  const hasSelectedValue: boolean = !!formik.values[`${name}`];
  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  useEffect(() => {
    const setDefaultValueHandler = () => {
      if (hasSelectedValue) return;
      // Set first color as default
      formik.values[`${name}`] = CATEGORY_COLORS[0].hex;
      setValue(CATEGORY_COLORS[0].hex);
    };

    setDefaultValueHandler();

    return () => {};
  }, [hasSelectedValue, formik, name]);

  const formikOnChangeHandler = (value: string) => {
    formik.values[`${name}`] = value;
    setValue(() => value);
  };

  // Find the selected color object
  const selectedColor = CATEGORY_COLORS.find((color) => color.hex === value);

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
              {selectedColor && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="text-gray-700 font-medium">
                    {selectedColor.name}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">
                    {selectedColor.hex}
                  </span>
                </div>
              )}
            </SelectTrigger>
            <SelectContent className={`max-h-[300px]`}>
              {CATEGORY_COLORS.map((color, index) => (
                <SelectItem
                  key={index}
                  value={color.hex}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 py-1">
                    <div
                      className="w-6 h-6 rounded-md border border-gray-300 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-gray-700 font-medium min-w-[80px]">
                      {color.name}
                    </span>
                    <span className="text-gray-500 text-sm">{color.hex}</span>
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

// Alternative version that returns the full color object instead of just hex
interface CategoryColorSelectWithObjectProps {
  formik?: any;
  name: string;
  label?: ReactNode;
  required?: boolean;
  transparent?: boolean;
}

export const CategoryColorSelectWithObject: React.FC<
  CategoryColorSelectWithObjectProps
> = (props) => {
  const formik = props.formik;
  const name = props.name;
  const label = props.label ? props.label : "Category Color";
  const required = props.required ? props.required : false;
  const transparent = props.transparent ? props.transparent : false;

  // Value stores the hex string for the select
  const [value, setValue] = useState<string>(
    formik.values[`${name}`]?.hex || CATEGORY_COLORS[0].hex
  );

  const hasSelectedValue: boolean = !!formik.values[`${name}`];
  const hasError = formik.errors[`${name}`] && formik.touched[`${name}`];

  useEffect(() => {
    const setDefaultValueHandler = () => {
      if (hasSelectedValue) return;
      // Set first color object as default
      formik.values[`${name}`] = CATEGORY_COLORS[0];
      setValue(CATEGORY_COLORS[0].hex);
    };

    setDefaultValueHandler();

    return () => {};
  }, [hasSelectedValue, formik, name]);

  const formikOnChangeHandler = (hexValue: string) => {
    const colorObject = CATEGORY_COLORS.find((color) => color.hex === hexValue);
    if (colorObject) {
      formik.values[`${name}`] = colorObject; // Store the full object
      setValue(hexValue);
    }
  };

  const selectedColor = CATEGORY_COLORS.find((color) => color.hex === value);

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
              {selectedColor && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="text-gray-700 font-medium">
                    {selectedColor.name}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">
                    {selectedColor.hex}
                  </span>
                </div>
              )}
            </SelectTrigger>
            <SelectContent className={`max-h-[300px]`}>
              {CATEGORY_COLORS.map((color, index) => (
                <SelectItem
                  key={index}
                  value={color.hex}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 py-1">
                    <div
                      className="w-6 h-6 rounded-md border border-gray-300 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-gray-700 font-medium min-w-[80px]">
                      {color.name}
                    </span>
                    <span className="text-gray-500 text-sm">{color.hex}</span>
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
