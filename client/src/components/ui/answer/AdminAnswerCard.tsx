import React, { useState } from "react";
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
import { QuillViewer } from "../shared/QuillViewer";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";

interface AdminAnswerCardProps {
  answer: TAnswer;
}

export const AdminAnswerCard: React.FC<AdminAnswerCardProps> = (props) => {
  const answer = props.answer;
  const attachments = answer.attachments;
  const hasAttachment = isArrayWithElements(attachments);
  const [closeUpdateAnswerModal, setCloseUpdateAnswerModal] = useState(false);

  const titleDelta = answer.isDeltaDefault
    ? answer.titleDelta!
    : JSON.stringify(convertPlainTextToDelta(answer.title));

  const onUpdateAnswerSuccess = (succeeded: boolean) => {
    setCloseUpdateAnswerModal(() => succeeded);
    setTimeout(() => {
      setCloseUpdateAnswerModal(() => false);
    }, 2000);
  };

  return (
    <div className="w-full flex items-center justify-center gap-4">
      <div>
        <Circle className="w-4 h-4 text-(--primary)" />
      </div>
      <div
        className="w-full flex flex-col sm:flex-row sm:items-center 
        sm:justify-center gap-2 sm:gap-4"
      >
        {hasAttachment && (
          <div className="w-20 border-1 border-gray-300 rounded-md">
            <img
              src={attachments[0].url}
              alt={truncateString(answer.title, 4)}
              className="w-full object-cover object-center rounded-md"
            />
          </div>
        )}
        <div className="w-full text-sm text-gray-600">
          {/* <span>{answer.title}</span> */}
          <QuillViewer deltaContent={titleDelta} />
        </div>
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
            closed={closeUpdateAnswerModal}
          >
            <div
              className="w-[90vw] sm:w-[80vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
                rounded-md p-4 flex items-start justify-center overflow-x-hidden"
            >
              <div className="w-full flex flex-col md:flex-row items-start justify-start gap-6">
                <div className="flex items-center">
                  <UpdateAnswerAttachment
                    answerID={answer.id}
                    attachmentID={hasAttachment ? attachments[0]?.id : ""}
                    attachmentURL={hasAttachment ? attachments[0]?.url : ""}
                    questionTitle={answer.title}
                    answerSequenceNumber={answer.sequenceNumber}
                  />
                </div>
                <div className="w-full">
                  <UpdateAnswer
                    answer={answer}
                    onSuccess={onUpdateAnswerSuccess}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </AppDropdown>
      </div>
    </div>
  );
};
