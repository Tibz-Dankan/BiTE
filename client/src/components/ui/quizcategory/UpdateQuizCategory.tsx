import React from "react";
import { AppDropdown } from "../shared/AppDropdown";
import { SCNButton } from "../shared/button";
import { Edit, MoreVertical } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "@headlessui/react";
import { UpdateQuizCategoryAttachment } from "../../pages/quiz/UpdateQuizAttachment";
import { UpdateQuizCategoryForm } from "./UpdateQuizCategoryForm";
import type { TQuizCategory } from "../../../types/quizCategory";

interface UpdateQuizCategoryProps {
  quizCategory: TQuizCategory;
}

export const UpdateQuizCategory: React.FC<UpdateQuizCategoryProps> = () => {
  return (
    <div>
      <AppDropdown
        label={
          <SCNButton className="p-1 py-0 h-6 bg-green-500s">
            <MoreVertical className="w-5 h-5 text-gray-800" />
          </SCNButton>
        }
      >
        <Modal
          openModalElement={
            <div>
              <Button
                type="button"
                className="flex items-center justify-center gap-2 h-auto py-1
                   px-3 bg-transparent w-32"
              >
                <Edit className="w-4 h-4 text-gray-800" />
                <span className="text-[12px] text-gray-800">Edit Answer</span>
              </Button>
            </div>
          }
          //   closed={closeUpdateAnswerModal}
          closed={false}
        >
          <div
            className="w-[90vw] sm:w-[80vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
                rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
              <div className="flex items-center">
                <UpdateQuizCategoryAttachment
                  answerID={""}
                  attachmentID={""}
                  attachmentURL={""}
                  questionTitle={""}
                  answerSequenceNumber={0} // answerID={answer.id}
                  // attachmentID={hasAttachment ? attachments[0]?.id : ""}
                  // attachmentURL={hasAttachment ? attachments[0]?.url : ""}
                  // questionTitle={answer.title}
                  // answerSequenceNumber={answer.sequenceNumber}
                />
              </div>
              <div className="w-full">
                <UpdateQuizCategoryForm
                  quizCategory={{
                    id: "",
                    title: "",
                    titleDelta: "",
                    titleHTML: "",
                    isDeltaDefault: false,
                    postedByUserID: "",
                    questionID: "",
                    sequenceNumber: 0,
                    isCorrect: false,
                    createdAt: "",
                    updatedAt: "",
                    attachments: [],
                  }}
                  onSuccess={function (succeeded: boolean): void {
                    console.log("succeeded: ", succeeded);
                    throw new Error("Function not implemented.");
                  }} // answer={answer}
                  // onSuccess={onUpdateAnswerSuccess}
                />
              </div>
            </div>
          </div>
        </Modal>
      </AppDropdown>
    </div>
  );
};
