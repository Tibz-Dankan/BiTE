import React, { Fragment, useState, useEffect, type ReactNode } from "react";
// import { FilePicker } from "./file-picker";
// import { truncateString } from "@/utils/truncate-string";
import { Upload, FileText } from "lucide-react";
import { truncateString } from "../../utils/truncateString";
import { FilePicker } from "./FilePicker";

interface InputFilePickerProps {
  formik?: any;
  name: string;
  label?: ReactNode;
}

export const InputFilePicker: React.FC<InputFilePickerProps> = (props) => {
  const formik = props.formik;
  const label = props.label;
  const name = props.name;
  const [fileError, setFileError] = useState(formik.errors[`${name}`]);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState<string>("");

  const onSaveHandler = (file: any, filename?: string) => {
    formik.values[`${name}`] = file;
    delete formik.errors[`${name}`];

    setFileError(() => "");
    setFile(() => formik.values[`${name}`]);

    if (filename) {
      setFilename(() => filename);
    }
  };

  const onErrorHandler = (errorList: any[]) => {
    formik.errors[`${name}`] = errorList[0]?.reason.toLowerCase();
    setFileError(() => formik.errors[`${name}`]);
    setFile(() => null);
  };

  useEffect(() => {
    const updateErrorHandler = () => {
      setFileError(() => formik.errors[`${name}`]);
    };
    updateErrorHandler();
  }, [formik, name]);

  useEffect(() => {
    return () => {
      delete formik.values[`${name}`];
      delete formik.errors[`${name}`];

      setFile(() => null);
      setFileError(() => "");
    };
  }, [formik, name]);

  return (
    <Fragment>
      <div
        className="relative py-2 flex flex-col items-start
          justify-center gap-1 w-full"
      >
        <label
          className={`text-sm first-letter:uppercase font-[450]
           ${fileError ? "text-red-400" : "text-gray-800"}`}
        >
          {label}
        </label>
        <div className="w-full relative">
          {!file && (
            <FilePicker
              className="w-full"
              onSave={onSaveHandler}
              onError={onErrorHandler}
              acceptableFileType={".pdf"}
              validFileTypeList={["pdf"]}
            >
              <div
                id={name}
                className={`p-2 rounded-md border-[2px] text-gray-600
                transition-all text-base w-full cursor-pointer ${
                  fileError ? "border-red-400" : "border-gray-300"
                }`}
              >
                <p className="w-full flex items-start justify-center gap-1">
                  <span>
                    <Upload className="w-4 h-4" />
                  </span>
                  <span className="text-sm">Pick File</span>
                </p>
              </div>
            </FilePicker>
          )}
          {file && (
            <div
              className={`p-4 rounded border-[1px] text-gray-800
                transition-all text-base w-full ${
                  fileError ? "border-red-400" : "border-gray-300"
                }`}
            >
              <p className="w-full flex items-start justify-center gap-1">
                <span>
                  <FileText className="w-5 h-5" />
                </span>
                <span>{`${truncateString(filename, 15)}`}</span>
              </p>
            </div>
          )}
        </div>
        {fileError && (
          <p
            className="absolute -bottom-3 left-0 text-sm text-red-400
            first-letter:uppercase"
          >
            {fileError}
          </p>
        )}
      </div>
    </Fragment>
  );
};
