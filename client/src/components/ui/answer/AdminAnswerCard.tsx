import React from "react";
import type { TAnswer } from "../../../types/answer";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { truncateString } from "../../../utils/truncateString";
import { Circle, Edit, MoreVertical } from "lucide-react";
import { SCNButton } from "../shared/button";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import { UpdateAnswerAttachment } from "./UpdateAnswerAttachment";
import { UpdateAnswer } from "./UpdateAnswer";
import { AppDropdown } from "../shared/AppDropdown";

interface AdminAnswerCardProps {
  answer: TAnswer;
}

export const AdminAnswerCard: React.FC<AdminAnswerCardProps> = (props) => {
  const answer = props.answer;
  const attachments = answer.attachments;
  const hasAttachment = isArrayWithElements(attachments);

  return (
    <div className="w-full flex items-center justify-center gap-4">
      <div>
        <Circle className="w-4 h-4 text-(--primary)" />
      </div>
      {hasAttachment && (
        <div className="w-20 border-1 border-gray-300 rounded-md">
          <img
            src={attachments[0].url}
            alt={truncateString(answer.title, 4)}
            className="w-full object-cover object-center rounded-md"
          />
        </div>
      )}
      <div className="w-full text-sm text-gray-800">
        <span>{answer.title}</span>
      </div>
      <div>
        {/* <MoreVertical className="w-5 h-5 text-gray-800" /> */}
        {/* Question actions drop down */}

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
          >
            <div
              className="w-full sm:w-[50vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
                rounded-md p-4 flex items-start justify-center overflow-x-hidden"
            >
              <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
                <div className="flex items-center">
                  <UpdateAnswerAttachment
                    answerID={answer.id}
                    attachmentID={answer.attachments[0]?.id ?? ""}
                    attachmentURL={answer.attachments[0]?.url ?? ""}
                    questionTitle={answer.title}
                    answerSequenceNumber={answer.sequenceNumber}
                  />
                </div>
                <div className="w-full">
                  <UpdateAnswer answer={answer} />
                </div>
              </div>
            </div>
          </Modal>
        </AppDropdown>
      </div>
    </div>
  );
};
