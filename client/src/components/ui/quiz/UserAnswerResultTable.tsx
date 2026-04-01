import React from "react";
import type { TAnswer } from "../../../types/answer";
import type { Attempt, TAttemptStatus } from "../../../types/attempt";
import { QuillViewer } from "../shared/QuillViewer";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { isJSON } from "../../../utils/isJson";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { truncateString } from "../../../utils/truncateString";
import { Check, X } from "lucide-react";

interface UserAnswerResultTableProps {
  answers: TAnswer[];
  attempts: Attempt[];
  attemptStatuses: TAttemptStatus[];
}

export const UserAnswerResultTable: React.FC<UserAnswerResultTableProps> = ({
  answers,
  attempts,
  attemptStatuses,
}) => {
  const getUserAttemptForAnswer = (answerId: string) => {
    return attempts.find((attempt) => attempt.answerID === answerId);
  };

  const isUserAttemptCorrect = (attemptId: string) => {
    const status = attemptStatuses.find((s) => s.attemptID === attemptId);
    return status?.IsCorrect ?? false;
  };

  const getAnswerTitleDelta = (answer: TAnswer) => {
    return answer.isDeltaDefault
      ? isJSON(answer.titleDelta!)
        ? answer.titleDelta!
        : JSON.stringify(convertPlainTextToDelta(answer.title))
      : JSON.stringify(convertPlainTextToDelta(answer.title));
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Correct Ans
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Your Ans
            </th>
            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Content
            </th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer) => {
            const userAttempt = getUserAttemptForAnswer(answer.id);
            const wasSelected = !!userAttempt;
            const isAttemptCorrect = wasSelected
              ? isUserAttemptCorrect(userAttempt.id)
              : false;
            const attachments = answer.attachments;
            const hasAttachments = isArrayWithElements(attachments);
            const titleDelta = getAnswerTitleDelta(answer);

            return (
              <tr key={answer.id} className="border-b border-gray-200">
                {/* Correct Ans column */}
                <td className="py-3 px-3 border border-gray-200 text-center align-middle">
                  {answer.isCorrect && (
                    <Check size={18} className="text-green-600 mx-auto" />
                  )}
                </td>

                {/* Your Ans column */}
                <td className="py-3 px-3 border border-gray-200 text-center align-middle">
                  {wasSelected && (
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded ${
                        isAttemptCorrect
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {isAttemptCorrect ? <Check size={18} /> : <X size={18} />}
                    </div>
                  )}
                </td>

                {/* Content column */}
                <td className="py-3 px-3 border border-gray-200 align-middle">
                  <div className="flex items-center gap-2">
                    {hasAttachments && (
                      <div className="w-16 flex-shrink-0 border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={attachments[0].url}
                          alt={truncateString(answer.title, 4)}
                          className="w-full object-cover object-center rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <QuillViewer deltaContent={titleDelta} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
