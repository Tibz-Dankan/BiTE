import React from "react";
import type { Quiz } from "../../../types/quiz";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { getQuizStatus } from "../../../utils/getQuizStatus";
import { elapsedTime } from "../../../utils/elapseTime";
import { AppDate } from "../../../utils/appDate";
import { truncateString } from "../../../utils/truncateString";
import { Link } from "react-router-dom";
import { useRouteStore } from "../../../stores/routes";

type QuizCardProps = {
  quiz: Quiz;
};

export const QuizCard: React.FC<QuizCardProps> = (props) => {
  const quiz = props.quiz;
  const hasAttachment = isArrayWithElements(quiz.attachments);
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const getQuizStatusColor = (quiz: Quiz) => {
    const status = getQuizStatus(quiz.startsAt, quiz.endsAt);

    if (status === "upcoming") return "bg-blue-500";
    if (status === "running") return "bg-green-500";
    if (status === "expired") return "bg-gray-500";
  };

  const getQuizElapseTime = (quiz: Quiz) => {
    const status = getQuizStatus(quiz.startsAt, quiz.endsAt);

    if (status === "upcoming") {
      const timeDuration = elapsedTime(quiz.startsAt);
      const startDate = new AppDate(quiz.startsAt).monthDayYear();
      const endDate = new AppDate(quiz.endsAt).monthDayYear();
      return `Starts in ${timeDuration} (${startDate} - ${endDate})`;
    }

    if (status === "running") {
      const timeDuration = elapsedTime(quiz.startsAt);
      const startDate = new AppDate(quiz.startsAt).monthDayYear();
      const endDate = new AppDate(quiz.endsAt).monthDayYear();
      return `Started ${timeDuration} (${startDate} - ${endDate})`;
    }

    if (status === "expired") {
      const timeDuration = elapsedTime(quiz.startsAt);
      const startDate = new AppDate(quiz.startsAt).monthDayYear();
      const endDate = new AppDate(quiz.endsAt).monthDayYear();
      return `Ended ${timeDuration} ago (${startDate} - ${endDate})`;
    }
  };

  const updateAdminQuizEditPage = () => {
    updateCurrentPage({
      title: "Edit Quiz",
      icon: undefined,
      path: "/a/quizzes/:quizID",
      showInSidebar: false,
      element: undefined,
    });

    console.log("Updated the admin quiz edit page in  the store");
  };

  return (
    <div
      className="w-full border-[1px] border-gray-300 rounded-lg
      flex items-center gap-4s bg-gray-800/5"
    >
      <div className="w-20 h-20 rounded-l-lg flex items-center justify-center">
        {/* To add big image viewer */}
        {hasAttachment && (
          <img
            src={quiz.attachments[0].url}
            alt={quiz.attachments[0].filename}
            className="w-full h-full rounded-l-lg bg-cover bg-center bg-gray-500"
          />
        )}
        {!hasAttachment && (
          <div
            className="w-full h-full flex items-center justify-center rounded-l-lg
            bg-gray-500"
          >
            <span className="text-gray-100 font-semibold">
              {truncateString(quiz.title, 6)}
            </span>
          </div>
        )}
      </div>
      <Link
        to={`/a/quizzes/${quiz.id}`}
        className="flex flex-1 flex-col justify-between gap-2 h-20 p-3"
        onClick={() => updateAdminQuizEditPage()}
      >
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span className="first-letter:uppercase">
            {getQuizStatus(quiz.startsAt, quiz.endsAt)}
          </span>
          <span className="w-1 h-1 bg-gray-500 rounded-full" />
          <span>{getQuizElapseTime(quiz)}</span>
        </div>
        <div>
          <h2>{quiz.title}</h2>
        </div>
      </Link>
      <div className={`h-20 w-2 ${getQuizStatusColor(quiz)} rounded-r-lg`} />
    </div>
  );
};
