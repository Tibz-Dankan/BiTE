import React, { useState } from "react";
import { useNotificationStore } from "../../../stores/notification";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../shared/Btn";
import {
  Loader2,
  Paperclip,
  Pencil,
  Plus,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import { FilePicker } from "../shared/FilePicker";
import { Modal } from "../shared/Modal";
import { AlertCard } from "../shared/AlertCard";
import { questionAPI } from "../../../api/question";

interface UpdateQuestionAttachmentProps {
  questionID: string;
  attachmentID: string;
  attachmentURL: string;
  questionTitle: string;
  questionSequenceNumber: number;
}

export const UpdateQuestionAttachment: React.FC<
  UpdateQuestionAttachmentProps
> = (props) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<ArrayBuffer>();

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );

  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: questionAPI.updateQuestionAttachment,
    onSuccess: async (response: any) => {
      console.log("response", response);
      setShowImagePreview(() => false);
      setFile(() => null as any);
      showCardNotification({
        type: "success",
        message: response.message,
      });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const uploadFileHandler = (file: any) => {
    const formData = new FormData();
    formData.append("file", new Blob([file]));

    mutate({
      questionID: props.questionID,
      attachmentID: props.attachmentID,
      formData: formData,
    });
  };

  const onSaveHandler = (file: any) => {
    setFileError(() => "");
    setShowImagePreview(() => true);
    setFile(() => file);
  };

  const onErrorHandler = (errorList: any) => {
    const error = errorList[0]?.reason.toLowerCase();
    setFileError(() => error);
    setShowImagePreview(() => false);
    setFile(() => null as any);
  };

  const closeImagePreviewHandler = () => {
    setShowImagePreview(() => false);
    setFile(() => undefined);
  };

  const getImageURL = (file: any) => {
    const blob = new Blob([file as ArrayBuffer], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <Modal
        openModalElement={
          <div className="w-full">
            <label className="text-sm font-[450] text-gray-800">
              Attachment(Image)
            </label>
            {props.attachmentURL && (
              <div
                className="w-80 min-h-32 flex items-center justify-center gap-2 relative
                border-[1px] border-gray-300 rounded-md cursor-pointer
                mt-3"
              >
                <img
                  src={props.attachmentURL}
                  alt="quiz-img-display"
                  className="w-full object-cover object-center rounded-md"
                />
                <span
                  className="z-10 p-2 rounded-full absolute bottom-4 right-4
                  bg-(--primary)"
                >
                  <Pencil className="text-gray-50 w-4 h-4" />
                </span>
              </div>
            )}
            {!props.attachmentURL && (
              <div
                className="w-80 min-h-32 flex items-center justify-centers gap-2 relative
                border-[1px] border-gray-300 rounded-md cursor-pointer
                bg-gray-400 mt-3"
              >
                <div className="w-full aspect-4/2 object-cover" />
                <span
                  className="z-10 p-2 rounded-full absolute bottom-4 right-4
                  bg-(--primary)"
                >
                  <Plus className="text-gray-50 w-4 h-4" strokeWidth={2} />
                </span>
              </div>
            )}
          </div>
        }
      >
        <div
          className="w-[50vw] min-h-[50vh] flex flex-col items-center
           p-8 space-y-8 bg-gray-50 rounded-md"
        >
          {fileError && (
            <div className="w-full">
              <AlertCard type="error" message={fileError} />
            </div>
          )}

          {showImagePreview && (
            <div className="relative">
              <img
                src={getImageURL(file)}
                alt={"preview"}
                className="object-cover object-center rounded-md"
              />
              <span
                className="absolute top-2 right-2 bg-gray-50/80 rounded-full p-2
                cursor-pointer hover:text-(--primary) shadow-sm"
                onClick={() => closeImagePreviewHandler()}
              >
                <X className="w-4 h-4 text-gray-800 hover:text-inherit" />
              </span>
            </div>
          )}

          {!showImagePreview && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-8">
              <p className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="flex items-center gap-1">
                  <span>Update Question</span>
                  <span className="font-semibold text-gray-800">
                    {/* {truncateString(props.quizTitle, 6)}{" "} */}
                    {props.questionSequenceNumber}
                  </span>
                  <span>Image Attachment</span>
                </span>
              </p>
              <FilePicker
                acceptableFileType={"image/*"}
                validFileTypeList={["png", "jpg", "jpeg", "webp"]}
                onSave={onSaveHandler}
                onError={onErrorHandler}
                className="bg-(--primary) rounded-md"
              >
                <span
                  className="flex items-center justify-center px-4 py-2 bg-primary
                  rounded-md text-gray-100 gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                </span>
              </FilePicker>
            </div>
          )}

          {file && !fileError && (
            <div className="w-full flex items-center justify-center sm:justify-end">
              <Button
                type="button"
                onClick={() => uploadFileHandler(file)}
                className="w-full sm:w-40"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
