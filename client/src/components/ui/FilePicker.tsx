import React, { type ReactNode, useEffect, Fragment, useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
} from "use-file-picker/validators";
import { twMerge } from "tailwind-merge";

interface FilePickerProps {
  validFileTypeList: string[];
  children: ReactNode;
  acceptableFileType: string;
  onSave: (file: any, filename?: string) => void;
  onError: (ErrorList: any) => void;
  className?: string;
}

export const FilePicker: React.FC<FilePickerProps> = (props) => {
  const [file, setFile] = useState<any>(null);
  const [filename, setFilename] = useState<string>("");

  const validFileTypeList = props.validFileTypeList;
  const acceptFileType = props.acceptableFileType;

  const { openFilePicker, filesContent, errors } = useFilePicker({
    readAs: "ArrayBuffer",
    accept: acceptFileType,
    multiple: true,

    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(validFileTypeList),
      new FileSizeValidator({ maxFileSize: 20 * 1024 * 1024 /* 20 MB */ }),
    ],
  });

  useEffect(() => {
    filesContent.map((file) => {
      console.log("file", file);
      setFilename(file.name);
      return setFile(() => file.content);
    });
  }, [filesContent]);

  useEffect(() => {
    const saveHandler = () => {
      if (!file) return;

      if (filename) {
        props.onSave(file, filename);
        return;
      }
      props.onSave(file);
    };
    saveHandler();
  }, [file, filename]);

  useEffect(() => {
    const fileErrorHandler = () => {
      if (errors.length === 0) return;
      props.onError(errors);
    };
    fileErrorHandler();
  }, [errors, errors.length, props]);

  return (
    <Fragment>
      <button
        onClick={() => openFilePicker()}
        type={"button"}
        className={twMerge(`bg-transparent`, props.className)}
      >
        {props.children}
      </button>
    </Fragment>
  );
};
