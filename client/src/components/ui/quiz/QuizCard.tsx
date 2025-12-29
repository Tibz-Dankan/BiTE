import React from "react";
import type { TQuiz } from "../../../types/quiz";
import { isArrayWithElements } from "../../../utils/isArrayWithElements";
import { getQuizStatus } from "../../../utils/getQuizStatus";
import { elapsedTime } from "../../../utils/elapseTime";
import { AppDate } from "../../../utils/appDate";
import { truncateString } from "../../../utils/truncateString";
import { Link, useNavigate } from "react-router-dom";
import { useRouteStore } from "../../../stores/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shared/dropdown-menu";
import { SCNButton } from "../shared/button";
import {
  Copy,
  Edit,
  MoreVertical,
  Settings,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { QuillViewer } from "../shared/QuillViewer";
import { convertPlainTextToDelta } from "../../../utils/convertPlainTextToDelta";
import { isJSON } from "../../../utils/isJson";

type QuizCardProps = {
  quiz: TQuiz;
};

export const QuizCard: React.FC<QuizCardProps> = (props) => {
  const quiz = props.quiz;
  const hasAttachment = isArrayWithElements(quiz.attachments);
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);
  const navigate = useNavigate();

  const getQuizStatusColor = (quiz: TQuiz) => {
    const status = getQuizStatus(quiz.startsAt, quiz.endsAt);

    if (status === "upcoming") return "bg-blue-500";
    if (status === "running") return "bg-green-500";
    if (status === "expired") return "bg-gray-500";
  };

  const getQuizElapseTime = (quiz: TQuiz) => {
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
      return `Started ${timeDuration} ago (${startDate} - ${endDate})`;
    }

    if (status === "expired") {
      const timeDuration = elapsedTime(quiz.startsAt);
      const startDate = new AppDate(quiz.startsAt).monthDayYear();
      const endDate = new AppDate(quiz.endsAt).monthDayYear();
      return `Ended ${timeDuration} ago (${startDate} - ${endDate})`;
    }
  };

  const updateAdminQuizEditPage = () => {
    navigate(`/a/quizzes/${quiz.id}/edit`);
    updateCurrentPage({
      title: "Edit Quiz",
      icon: undefined,
      path: "/a/quizzes/:quizID/edit",
      showInSidebar: false,
      element: undefined,
    });

    console.log("Updated the admin quiz edit page in  the store");
  };

  const navigateToQuestionsPage = () => {
    navigate(`/a/quizzes/${quiz.id}/questions`);
    updateCurrentPage({
      title: "Questions",
      icon: undefined,
      path: `/a/quizzes/${quiz.id}/questions`,
      showInSidebar: false,
      element: undefined,
    });
  };

  const updateAdminQuizAttemptPage = () => {
    navigate(`/a/quizzes/${quiz.id}/attempt`);
    updateCurrentPage({
      title: "Quiz Attemptability",
      icon: undefined,
      path: "/a/quizzes/:quizID/attempt",
      showInSidebar: false,
      element: undefined,
    });

    console.log("Updated the admin quiz attempt page in the store");
  };

  const deltaContent = quiz.isDeltaDefault
    ? isJSON(quiz.titleDelta!)
      ? quiz.titleDelta!
      : JSON.stringify(convertPlainTextToDelta(quiz.titleDelta))
    : JSON.stringify(convertPlainTextToDelta(quiz.titleDelta));

  return (
    <div
      className="w-full border-[1px] border-gray-300 rounded-lg
      flex flex-col sm:flex-row items-center  bg-gray-800/5
      relative"
    >
      <div
        className="w-full p-6 pb-0 sm:p-0 sm:w-20 sm:h-20 rounded-lg
         sm:rounded-none sm:rounded-l-lg flex items-center justify-center"
      >
        {/* To add big image viewer */}
        {hasAttachment && (
          <img
            src={quiz.attachments[0].url}
            alt={quiz.attachments[0].filename}
            className="w-full h-full rounded-lg sm:rounded-none sm:rounded-l-lg
             object-cover object-center
             bg-gray-500"
          />
        )}
        {!hasAttachment && (
          <div
            className="w-full h-full aspect-[2/1] flex items-center justify-center
             rounded-lg sm:rounded-none sm:rounded-l-lg bg-gray-500"
          >
            <span className="text-gray-100 font-semibold">
              {truncateString(quiz.title, 6)}
            </span>
          </div>
        )}
      </div>
      <Link
        to={`/a/quizzes/${quiz.id}/questions`}
        className="w-full px-6 pb-4 sm:pb-0 flex flex-1 flex-col 
        justify-between gap-2 h-full p-3 z-10 relative"
        onClick={() => navigateToQuestionsPage()}
      >
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span className="first-letter:uppercase">
            {getQuizStatus(quiz.startsAt, quiz.endsAt)}
          </span>
          <span className="w-1 h-1 bg-gray-500 flex-shrink-0 rounded-full" />
          <span>{getQuizElapseTime(quiz)}</span>
        </div>
        <div className="w-full">
          {/* <h2>{quiz.title}</h2> */}
          <QuillViewer deltaContent={deltaContent} />
        </div>
      </Link>
      <div className="absolute -top-1 right-0 sm:relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SCNButton className="p-1 py-0">
              <MoreVertical className="w-5 h-5 text-gray-800" />
            </SCNButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="bg-gray-50">
            <DropdownMenuItem onClick={() => updateAdminQuizEditPage()}>
              <span className="flex items-center gap-2 cursor-pointer">
                <Edit className="w-4 h-4 text-gray-800" />
                Edit Quiz
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateAdminQuizAttemptPage()}>
              <span className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4 text-gray-800" />
                Make Quiz Attemptable
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const path = quiz.showQuiz
                  ? `/a/quizzes/${quiz.id}/hide`
                  : `/a/quizzes/${quiz.id}/show`;
                navigate(path);
              }}
            >
              <span className="flex items-center gap-2 cursor-pointer text-gray-800">
                {quiz.showQuiz ? (
                  <>
                    <EyeOff className="w-4 h-4 text-inherit" />
                    Hide Quiz
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-inherit" />
                    Show Quiz
                  </>
                )}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/a/quizzes/${quiz.id}/duplicate`)}
            >
              <span className="flex items-center gap-2 cursor-pointer text-gray-800">
                <Copy className="w-4 h-4 text-inherit" />
                Duplicate Quiz
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/a/quizzes/${quiz.id}/delete`)}
            >
              <span className="flex items-center gap-2 cursor-pointer text-gray-800">
                <Trash2 className="w-4 h-4 text-inherit" />
                Delete Quiz
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={`hidden sm:block h-20 w-2 ${getQuizStatusColor(
          quiz
        )} rounded-r-lg`}
      />
    </div>
  );
};
