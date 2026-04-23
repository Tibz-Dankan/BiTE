import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { aiPreviewAPI } from "../../../api/aiPreview";
import { Button } from "../shared/Btn";
import { Modal } from "../shared/Modal";
import { GenerateAllAIPreviewsForm } from "./GenerateAllAIPreviewsForm";
import { ShowAllAIPreviewsForm } from "./ShowAllAIPreviewsForm";
import { HideAllAIPreviewsForm } from "./HideAllAIPreviewsForm";

interface QuizAIPreviewOpsCardProps {
  quizID: string;
}

export const QuizAIPreviewOpsCard: React.FC<QuizAIPreviewOpsCardProps> = (
  props,
) => {
  const [closeGenerateModal, setCloseGenerateModal] = useState(false);
  const [closeShowModal, setCloseShowModal] = useState(false);
  const [closeHideModal, setCloseHideModal] = useState(false);

  const { data } = useQuery({
    queryKey: [`aipreview-exists-${props.quizID}`],
    queryFn: () => aiPreviewAPI.checkExistsByQuiz({ quizID: props.quizID }),
  });

  const hasAIPreviews: boolean = data?.data?.hasAIPreviews ?? false;

  const onGenerateSuccess = (succeeded: boolean) => {
    setCloseGenerateModal(() => succeeded);
    setTimeout(() => {
      setCloseGenerateModal(() => false);
    }, 2000);
  };

  const onShowSuccess = (succeeded: boolean) => {
    setCloseShowModal(() => succeeded);
    setTimeout(() => {
      setCloseShowModal(() => false);
    }, 2000);
  };

  const onHideSuccess = (succeeded: boolean) => {
    setCloseHideModal(() => succeeded);
    setTimeout(() => {
      setCloseHideModal(() => false);
    }, 2000);
  };

  return (
    <div
      className="w-full flex flex-col sm:flex-row items-start sm:items-center
       justify-between gap-4 p-4 rounded-xl border-1 border-gray-300
       bg-gray-50"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800">AI Preview</h3>
        <p className="text-xs text-gray-500">
          Manage AI preview for all questions of this quiz
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* Generate for All */}
        <Modal
          openModalElement={
            <Button
              type="button"
              className="h-auto py-[6px] px-3 text-xs bg-transparent
               text-gray-700 border-1 border-gray-400
               hover:border-(--clr-primary) hover:text-(--clr-primary)"
            >
              Generate for All
            </Button>
          }
          closed={closeGenerateModal}
        >
          <div
            className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh] bg-gray-50
            rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <GenerateAllAIPreviewsForm
              quizID={props.quizID}
              onSuccess={onGenerateSuccess}
            />
          </div>
        </Modal>

        {/* Show All */}
        <Modal
          openModalElement={
            <Button
              type="button"
              disabled={!hasAIPreviews}
              className="h-auto py-[6px] px-3 text-xs bg-transparent
               text-gray-700 border-1 border-gray-400
               hover:border-(--clr-primary) hover:text-(--clr-primary)"
            >
              Show All
            </Button>
          }
          closed={closeShowModal}
        >
          <div
            className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh] bg-gray-50
            rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <ShowAllAIPreviewsForm
              quizID={props.quizID}
              onSuccess={onShowSuccess}
            />
          </div>
        </Modal>

        {/* Hide All */}
        <Modal
          openModalElement={
            <Button
              type="button"
              disabled={!hasAIPreviews}
              className="h-auto py-[6px] px-3 text-xs bg-transparent
               text-gray-700 border-1 border-gray-400
               hover:border-(--clr-primary) hover:text-(--clr-primary)"
            >
              Hide All
            </Button>
          }
          closed={closeHideModal}
        >
          <div
            className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh] bg-gray-50
            rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <HideAllAIPreviewsForm
              quizID={props.quizID}
              onSuccess={onHideSuccess}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};
