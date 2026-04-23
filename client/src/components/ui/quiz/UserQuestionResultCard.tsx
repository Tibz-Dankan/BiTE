import React from "react";
import type { TQuestionWithAttempts } from "../../../types/attempt";
import { CheckCircle, XCircle } from "lucide-react";
import { QuillViewer } from "../shared/QuillViewer";
import { isJSON } from "../../../utils/isJson";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { UserAnswerResultTable } from "./UserAnswerResultTable";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { truncateString } from "../../../utils/truncateString";
import { QuestionPreviewSummaryCard } from "../aipreview/QuestionPreviewSummaryCard";
import { useFeatureFlagEnabled } from "@posthog/react";

interface UserQuestionResultCardProps {
  question: TQuestionWithAttempts;
  instructionsDelta?: string;
}

export const UserQuestionResultCard: React.FC<UserQuestionResultCardProps> = ({
  question,
  instructionsDelta,
}) => {
  const attemptStatus = question.attemptStatuses?.[0];
  const isCorrect = attemptStatus?.IsCorrect;
  const questionAttachments = question.attachments;
  const hasQuestionAttachments = isArrayWithElements(questionAttachments);

  const isAIPreviewUserFlagEnabled = useFeatureFlagEnabled("ai-preview-user");

  const questionTitleDelta = question.isDeltaDefault
    ? isJSON(question.titleDelta!)
      ? question.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(question.title))
    : JSON.stringify(convertPlainTextToDelta(question.title));

  const defaultAIPreview = question.aiPreviews?.find(
    (preview) => preview.isDefault,
  );
  const showPreviewSummary = question.showAIPreview && !!defaultAIPreview;

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-slate-800">
          Question {question.sequenceNumber}
        </h4>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              <span>Correct</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
              <XCircle size={16} />
              <span>Incorrect</span>
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-slate max-w-none mb-6">
        {hasQuestionAttachments && (
          <div className="flex flex-wrap gap-3 mb-3">
            {questionAttachments.map((attachment) => (
              <div
                key={attachment.id}
                className="w-32 border border-gray-300 rounded-md overflow-hidden"
              >
                <img
                  src={attachment.url}
                  alt={truncateString(question.title, 6)}
                  className="w-full object-cover object-center rounded-md"
                />
              </div>
            ))}
          </div>
        )}
        <QuillViewer deltaContent={questionTitleDelta} />
        {instructionsDelta && (
          <div className="mt-2">
            <QuillViewer deltaContent={instructionsDelta} />
          </div>
        )}
      </div>

      <UserAnswerResultTable
        answers={question.answers}
        attempts={question.attempts || []}
        attemptStatuses={question.attemptStatuses || []}
        requiresNumericalAnswer={question.requiresNumericalAnswer}
      />

      {isAIPreviewUserFlagEnabled && showPreviewSummary && (
        <QuestionPreviewSummaryCard aiPreview={defaultAIPreview} />
      )}
    </div>
  );
};
