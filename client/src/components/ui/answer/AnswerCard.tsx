import React from "react";
import type { TAnswer } from "../../../types/answer";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { truncateString } from "../../../utils/truncateString";
import { Circle, MoreVertical } from "lucide-react";

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
        <MoreVertical className="w-5 h-5 text-gray-800" />
      </div>
    </div>
  );
};
