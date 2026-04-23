import React, { useState } from "react";
import type { TAIPreview } from "../../../types/aiPreview";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  MoreVertical,
  RefreshCw,
  Star,
} from "lucide-react";
import { SCNButton } from "../shared/button";
import { AppDropdown } from "../shared/AppDropdown";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import { MakeDefaultAIPreviewForm } from "./MakeDefaultAIPreviewForm";
import { ShowQuestionAIPreviewForm } from "./ShowQuestionAIPreviewForm";
import { HideQuestionAIPreviewForm } from "./HideQuestionAIPreviewForm";
import { UpdateAIPreviewForm } from "./UpdateAIPreviewForm";
import { RegenerateAIPreviewForm } from "./RegenerateAIPreviewForm";

interface QuestionAIPreviewCardProps {
  aiPreviews: TAIPreview[];
  showAIPreview: boolean;
  questionID: string;
}

export const QuestionAIPreviewCard: React.FC<QuestionAIPreviewCardProps> = (
  props,
) => {
  const { aiPreviews, showAIPreview, questionID } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const [closeMakeDefaultModal, setCloseMakeDefaultModal] = useState(false);
  const [closeShowModal, setCloseShowModal] = useState(false);
  const [closeHideModal, setCloseHideModal] = useState(false);
  const [closeUpdateModal, setCloseUpdateModal] = useState(false);
  const [closeRegenerateModal, setCloseRegenerateModal] = useState(false);

  const hasAIPreviews = isArrayWithElements(aiPreviews);

  if (!hasAIPreviews) {
    return (
      <div className="w-full space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">AI Preview</h3>
        <p className="text-xs text-gray-400">
          No AI previews available for this question
        </p>
      </div>
    );
  }

  const currentPreview = aiPreviews[currentIndex];
  const totalPreviews = aiPreviews.length;
  const disableNav = totalPreviews <= 1;

  const goToPrevious = () => {
    if (disableNav) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPreviews - 1));
  };

  const goToNext = () => {
    if (disableNav) return;
    setCurrentIndex((prev) => (prev < totalPreviews - 1 ? prev + 1 : 0));
  };

  const onMakeDefaultSuccess = (succeeded: boolean) => {
    setCloseMakeDefaultModal(() => succeeded);
    setTimeout(() => {
      setCloseMakeDefaultModal(() => false);
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

  const onUpdateSuccess = (succeeded: boolean) => {
    setCloseUpdateModal(() => succeeded);
    setTimeout(() => {
      setCloseUpdateModal(() => false);
    }, 2000);
  };

  const onRegenerateSuccess = (succeeded: boolean) => {
    setCloseRegenerateModal(() => succeeded);
    setTimeout(() => {
      setCloseRegenerateModal(() => false);
    }, 2000);
  };

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">AI Preview</h3>
          {currentPreview.isDefault && (
            <span
              className="text-[10px] bg-(--clr-primary)/15 text-(--clr-primary)
               px-2 py-[1px] rounded-full font-medium"
            >
              Default
            </span>
          )}
          {/* Visibility label */}
          {showAIPreview ? (
            <span
              className="flex items-center gap-1 text-[10px] bg-green-100
               text-green-700 px-2 py-[1px] rounded-full font-medium"
            >
              <Eye className="w-3 h-3" />
              Visible To Users
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[10px] bg-gray-200
               text-gray-600 px-2 py-[1px] rounded-full font-medium"
            >
              <EyeOff className="w-3 h-3" />
              Invisible To Users
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation — always visible, disabled when only 1 preview */}
          <div className="flex items-center gap-1">
            <SCNButton
              className="p-0.5"
              onClick={goToPrevious}
              disabled={disableNav}
            >
              <ChevronLeft
                className={`w-4 h-4 ${disableNav ? "text-gray-300" : "text-gray-600"}`}
              />
            </SCNButton>
            <span className="text-xs text-gray-500 min-w-[3rem] text-center">
              {currentIndex + 1} of {totalPreviews}
            </span>
            <SCNButton
              className="p-0.5"
              onClick={goToNext}
              disabled={disableNav}
            >
              <ChevronRight
                className={`w-4 h-4 ${disableNav ? "text-gray-300" : "text-gray-600"}`}
              />
            </SCNButton>
          </div>

          {/* Actions dropdown — AppDropdown pattern */}
          <AppDropdown
            label={
              <SCNButton className="p-1 py-0 h-6">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </SCNButton>
            }
          >
            <div className="flex flex-col items-start gap-1 w-44">
              {/* Make Default — only when not already default */}
              {!currentPreview.isDefault && (
                <Modal
                  openModalElement={
                    <div>
                      <Button
                        type="button"
                        className="flex items-center justify-center gap-2 h-auto py-1
                       px-3 bg-transparent w-full"
                      >
                        <Star className="w-4 h-4 text-gray-800" />
                        <span className="text-[12px] text-gray-800">
                          Make Default
                        </span>
                      </Button>
                    </div>
                  }
                  closed={closeMakeDefaultModal}
                >
                  <div
                    className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh]
                    bg-gray-50 rounded-md p-4 flex items-start justify-center overflow-x-hidden"
                  >
                    <MakeDefaultAIPreviewForm
                      aiPreviewID={currentPreview.id}
                      onSuccess={onMakeDefaultSuccess}
                    />
                  </div>
                </Modal>
              )}

              {/* Show/Hide Preview */}
              {showAIPreview ? (
                <Modal
                  openModalElement={
                    <div>
                      <Button
                        type="button"
                        className="flex items-center justify-center gap-2 h-auto py-1
                       px-3 bg-transparent w-full"
                      >
                        <EyeOff className="w-4 h-4 text-gray-800" />
                        <span className="text-[12px] text-gray-800">
                          Hide Preview
                        </span>
                      </Button>
                    </div>
                  }
                  closed={closeHideModal}
                >
                  <div
                    className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh]
                    bg-gray-50 rounded-md p-4 flex items-start justify-center overflow-x-hidden"
                  >
                    <HideQuestionAIPreviewForm
                      questionID={questionID}
                      onSuccess={onHideSuccess}
                    />
                  </div>
                </Modal>
              ) : (
                <Modal
                  openModalElement={
                    <div>
                      <Button
                        type="button"
                        className="flex items-center justify-center gap-2 h-auto py-1
                       px-3 bg-transparent w-full"
                      >
                        <Eye className="w-4 h-4 text-gray-800" />
                        <span className="text-[12px] text-gray-800">
                          Show Preview
                        </span>
                      </Button>
                    </div>
                  }
                  closed={closeShowModal}
                >
                  <div
                    className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh]
                    bg-gray-50 rounded-md p-4 flex items-start justify-center overflow-x-hidden"
                  >
                    <ShowQuestionAIPreviewForm
                      questionID={questionID}
                      onSuccess={onShowSuccess}
                    />
                  </div>
                </Modal>
              )}

              {/* Update Preview */}
              <Modal
                openModalElement={
                  <div>
                    <Button
                      type="button"
                      className="flex items-center justify-center gap-2 h-auto py-1
                     px-3 bg-transparent w-full"
                    >
                      <Edit className="w-4 h-4 text-gray-800" />
                      <span className="text-[12px] text-gray-800">
                        Update Preview
                      </span>
                    </Button>
                  </div>
                }
                closed={closeUpdateModal}
              >
                <div
                  className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh]
                  bg-gray-50 rounded-md p-4 flex items-start justify-center overflow-x-hidden"
                >
                  <UpdateAIPreviewForm
                    aiPreviewID={currentPreview.id}
                    currentPrompt={currentPreview.prompt}
                    onSuccess={onUpdateSuccess}
                  />
                </div>
              </Modal>

              {/* Regenerate Preview */}
              <Modal
                openModalElement={
                  <div>
                    <Button
                      type="button"
                      className="flex items-center justify-center gap-2 h-auto py-1
                     px-3 bg-transparent w-full"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-800" />
                      <span className="text-[12px] text-gray-800">
                        Regenerate Preview
                      </span>
                    </Button>
                  </div>
                }
                closed={closeRegenerateModal}
              >
                <div
                  className="w-[90vw] sm:w-[50vw] min-h-[30vh] h-auto max-h-[80vh]
                  bg-gray-50 rounded-md p-4 flex items-start justify-center overflow-x-hidden"
                >
                  <RegenerateAIPreviewForm
                    questionID={questionID}
                    onSuccess={onRegenerateSuccess}
                  />
                </div>
              </Modal>
            </div>
          </AppDropdown>
        </div>
      </div>

      {/* Summary */}
      <div className="w-full space-y-1">
        <span className="text-xs font-medium text-gray-500">Summary</span>
        <div
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200
           max-h-48 overflow-y-auto"
        >
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {currentPreview.summary}
          </p>
        </div>
      </div>

      {/* Prompt */}
      <div className="w-full space-y-1">
        <span className="text-xs font-medium text-gray-500">Prompt</span>
        <div
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200
           max-h-32 overflow-y-auto"
        >
          <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
            {currentPreview.prompt}
          </p>
        </div>
      </div>
    </div>
  );
};
