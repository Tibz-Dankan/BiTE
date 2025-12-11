import React from "react";
import type { TAnswer } from "../../../types/answer";
import { QuillViewer } from "../shared/QuillViewer";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { isJSON } from "../../../utils/isJson";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { truncateString } from "../../../utils/truncateString";

interface AnswerItemCardProps {
  answer: TAnswer;
}

export const AnswerItemCard: React.FC<AnswerItemCardProps> = ({ answer }) => {
  const attachments = answer.attachments;
  const hasAttachment = isArrayWithElements(attachments);

  const titleDelta = answer.isDeltaDefault
    ? isJSON(answer.titleDelta!)
      ? answer.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(answer.title))
    : JSON.stringify(convertPlainTextToDelta(answer.title));

  return (
    <div className="w-full flex items-center justify-start gap-2">
      {hasAttachment && (
        <div className="w-20 border-1 border-gray-300 rounded-md">
          <img
            src={attachments[0].url}
            alt={truncateString(answer.title, 4)}
            className="w-full object-cover object-center rounded-md"
          />
        </div>
      )}
      <QuillViewer deltaContent={titleDelta} />
    </div>
  );
};
