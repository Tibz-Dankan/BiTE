import React from "react";
import type { TQuiz } from "../../../types/quiz";
import {
  Clock,
  Calendar,
  User as UserIcon,
  BookOpen,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

interface UserQuizCardProps {
  quiz: TQuiz;
}

export const UserQuizCard: React.FC<UserQuizCardProps> = ({ quiz }) => {
  const category = quiz.quizCategory;
  const categoryColor = category?.color || "from-gray-500 to-gray-600";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2">
      {/* Category Badge Header */}
      <div className={`h-2 bg-gradient-to-r ${categoryColor}`}></div>

      <div className="p-6">
        {/* Category Tag */}
        <div className="flex items-center justify-between mb-4">
          {category && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${categoryColor} text-white`}
            >
              {category.name}
            </span>
          )}
          {quiz.canBeAttempted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <CheckCircle size={14} />
              Active
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {quiz.title}
        </h3>

        {/* Introduction */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {quiz.introduction}
        </p>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              {quiz.questionCount || 0} Questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-700">
              {quiz.attemptCount || 0} Attempts
            </span>
          </div>
        </div>

        {/* Posted By */}
        {quiz.postedByUser && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
              style={{
                backgroundColor: quiz.postedByUser.profileBgColor || "#6366f1",
              }}
            >
              {quiz.postedByUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-500">Posted by</p>
              <p className="text-sm font-medium text-slate-700">
                {quiz.postedByUser.name}
              </p>
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={14} className="text-green-600" />
            <span>Starts: {formatDate(quiz.startsAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={14} className="text-red-600" />
            <span>Ends: {formatDate(quiz.endsAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group/btn ${
            quiz.canBeAttempted
              ? `bg-gradient-to-r ${categoryColor} text-white hover:shadow-lg`
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {quiz.canBeAttempted ? "Start Quiz" : "Coming Soon"}
          {quiz.canBeAttempted && (
            <ChevronRight
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          )}
        </button>
      </div>
    </div>
  );
};
