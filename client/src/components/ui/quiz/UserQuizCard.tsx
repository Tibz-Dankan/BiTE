import React from "react";
import type { TQuiz } from "../../../types/quiz";
import {
  Clock,
  Calendar,
  User as UserIcon,
  BookOpen,
  ChevronRight,
  CalendarClock,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import { getQuizStatus } from "../../../utils/getQuizStatus";
import { useNavigate } from "react-router-dom";

interface UserQuizCardProps {
  quiz: TQuiz;
}

export const UserQuizCard: React.FC<UserQuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();
  const placeHolderQuizCategory = {
    id: "b4149d00-6fe3-4f6f-b72e-eaca0e69ajdI",
    name: "Un Categorized",
    color: "#868e96",
  };
  const category = quiz.quizCategory ?? placeHolderQuizCategory;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const quizStatus = getQuizStatus(quiz.startsAt, quiz.endsAt);

  const getQuizStatusColor = () => {
    if (quizStatus === "upcoming")
      return {
        name: "Upcoming",
        icon: CalendarClock,
        color: "#3b82f6",
        bgColor: "#dbeafe",
      };
    if (quizStatus === "running")
      return {
        name: "Active",
        icon: PlayCircle,
        color: "#22c55e",
        bgColor: "#dcfce7",
      };
    if (quizStatus === "expired")
      return {
        name: "Ended",
        icon: StopCircle,
        color: "#6b7280",
        bgColor: "#f3f4f6",
      };
  };

  const getQuizCategoryColor = (quiz: TQuiz) => {
    if (quiz.quizCategory?.color) {
      return quiz.quizCategory.color;
    }
    return "#868e96";
  };

  const bgColor = getQuizCategoryColor(quiz);

  const navigateToQuizAttempt = (quiz: TQuiz) => {
    console.log("inside navigation to attempt quiz: ", quiz);
    navigate(`/u/quizzes/${quiz.id}/attempt`);
  };

  // const disableBtn =
  //   !quiz.canBeAttempted || quiz.userProgress?.status !== "COMPLETED";
  const disableBtn = !quiz.canBeAttempted || quiz.questions === null;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all
       duration-300 overflow-hidden group hover:-translate-y-2"
    >
      {/* Category Badge Header */}
      <div className="h-2" style={{ backgroundColor: bgColor }}></div>

      <div className="p-6">
        {/* Category Tag */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-slate-200 px-3 py-2 rounded-full">
            <div
              className="h-5 w-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            ></div>
            <span className="text-xs font-medium text-slate-500">
              {category?.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const statusInfo = getQuizStatusColor();
              if (statusInfo) {
                const StatusIcon = statusInfo.icon;
                return (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: statusInfo.bgColor }}
                  >
                    <StatusIcon size={16} style={{ color: statusInfo.color }} />
                    <span
                      className="text-sm font-medium"
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.name}
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold text-slate-800 mb-3 line-clamp-2
          group-hover:text-indigo-600 transition-colors"
        >
          {quiz.title}
        </h3>

        {/* Introduction */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {quiz.introduction}
        </p>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-(--primary)" />
            <span className="text-sm font-medium text-slate-700">
              {quiz.questionCount || 0} Questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon size={16} className="text-(--primary)" />
            <span className="text-sm font-medium text-slate-700">
              {quiz.attemptCount || 0} Attempts
            </span>
          </div>
        </div>

        {/* Posted By */}
        {quiz.postedByUser && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center
              text-white font-semibold"
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

        {/* User Progress */}
        {quiz.userProgress && (
          <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-600 mb-1">
              Your Progress
            </p>
            <div className="flex items-center justify-between text-sm text-orange-800">
              <span>
                Status:{" "}
                {quiz.userProgress.status === "IN_PROGRESS"
                  ? "In Progress"
                  : "Completed"}
              </span>
              <span>
                {quiz.userProgress.totalAttemptedQuestions} /{" "}
                {quiz.userProgress.totalQuestions}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-orange-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{
                  width: `${
                    (quiz.userProgress.totalAttemptedQuestions /
                      quiz.userProgress.totalQuestions) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-semibold transition-all flex
           items-center justify-center gap-2 group/btn ${
             quiz.canBeAttempted || quiz.userProgress?.status === "COMPLETED"
               ? "text-white hover:shadow-lg"
               : "text-slate-500 cursor-not-allowed"
           }`}
          style={{
            backgroundColor:
              quiz.canBeAttempted || quiz.userProgress ? bgColor : "#e2e8f0",
          }}
          onClick={() => {
            if (quiz.userProgress?.status === "COMPLETED") {
              navigate(`/u/quizzes/${quiz.id}/results`);
            } else {
              navigateToQuizAttempt(quiz);
            }
          }}
          disabled={disableBtn}
        >
          {quiz.userProgress?.status === "COMPLETED"
            ? "View Results"
            : quiz.userProgress?.status === "IN_PROGRESS"
            ? quiz.userProgress.totalAttemptedQuestions === 0
              ? "Start Quiz"
              : "Continue Attempt"
            : quiz.canBeAttempted
            ? "Start Quiz"
            : "Coming Soon"}

          {(quiz.canBeAttempted ||
            quiz.userProgress?.status === "COMPLETED") && (
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
