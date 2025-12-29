import React from "react";
import type { TQuizAttemptData } from "../../../types/attempt";
import { UserQuestionResultCard } from "./UserQuestionResultCard";
import { Trophy, Clock, CheckCircle2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserQuizResultCardProps {
  attemptData: TQuizAttemptData;
}

export const UserQuizResultCard: React.FC<UserQuizResultCardProps> = ({
  attemptData,
}) => {
  const navigate = useNavigate();
  const { data: quiz, progress } = attemptData;

  const correctCount = quiz.questions?.reduce((acc, q) => {
    const isCorrect = q.attemptStatuses?.[0]?.IsCorrect;
    return isCorrect ? acc + 1 : acc;
  }, 0);

  const finalScorePercentage = Math.round(
    (correctCount / progress.totalQuestions) * 100
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <button
        onClick={() => navigate("/u/quizzes")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        <span className="font-medium">Back to Quizzes</span>
      </button>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="bg-(--primary) p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-orange-100">Results Summary</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3">
              <Trophy size={24} />
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {finalScorePercentage}%
            </div>
            <div className="text-sm font-medium text-orange-600">
              Total Score
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">
              {correctCount}/{progress.totalQuestions}
            </div>
            <div className="text-sm font-medium text-green-600">
              Correct Answers
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
              <Clock size={24} />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              Completed
            </div>
            <div className="text-sm font-medium text-blue-600">Status</div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 px-2">
          Detailed Review
        </h2>
        {quiz.questions?.map((question) => (
          <UserQuestionResultCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};
