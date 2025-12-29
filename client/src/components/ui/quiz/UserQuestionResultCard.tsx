import React from "react";
import type { TQuestionWithAttempts } from "../../../types/attempt";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface UserQuestionResultCardProps {
  question: TQuestionWithAttempts;
}

export const UserQuestionResultCard: React.FC<UserQuestionResultCardProps> = ({
  question,
}) => {
  const attemptStatus = question.attemptStatuses?.[0];
  const userAttempt = question.attempts?.[0];
  const isCorrect = attemptStatus?.IsCorrect;

  // Find the selected answer title if it exists
  const selectedAnswer = question.answers.find(
    (a) => a.id === userAttempt?.answerID
  );

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
        <div
          dangerouslySetInnerHTML={{
            __html: question.titleHTML || question.title,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Your Answer
        </div>

        {selectedAnswer ? (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isCorrect
                ? "bg-green-100 border-green-300 text-green-900"
                : "bg-red-100 border-red-300 text-red-900"
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: selectedAnswer.titleHTML || selectedAnswer.title,
              }}
            />
            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
          </div>
        ) : (
          <div className="p-4 rounded-xl border bg-slate-100 border-slate-300 text-slate-500 italic flex items-center gap-2">
            <AlertCircle size={20} />
            No answer selected
          </div>
        )}

        {!isCorrect && (
          <div className="mt-4">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
              Correct Answer
            </div>
            {question.answers
              .filter((a) => a.isCorrect)
              .map((answer) => (
                <div
                  key={answer.id}
                  className="p-4 rounded-xl border bg-green-100 border-green-300 text-green-900 flex items-center justify-between mb-2"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: answer.titleHTML || answer.title,
                    }}
                  />
                  <CheckCircle size={20} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
