import React, { Fragment } from "react";
import { Routes } from "react-router-dom";
import {
  FileQuestion,
  LayoutDashboard,
  Settings,
  Trophy,
  XCircle,
} from "lucide-react";

import type { TRoute } from "../types/routes";
import { renderRoutes } from "./renderRoutes";
import { DashboardLayout } from "../components/layout/Dashboard";
import { PageNotFound } from "../components/pages/common/PageNotFound";
import { AdminQuizView } from "../components/pages/quiz/AdminQuizView";
import { AdminQuizUpdate } from "../components/pages/quiz/AdminQuizUpdate";
import { AdminQuizAttemptUpdate } from "../components/pages/quiz/AdminQuizAttemptUpdate";
import { AdminPostQuiz } from "../components/pages/quiz/AdminPostQuiz";
import { AdminPostQuestion } from "../components/pages/question/AdminPostQuestion";
import { AdminViewQuestions } from "../components/pages/question/AdminViewQuestions";
import { AdminUpdateQuestion } from "../components/pages/question/AdminUpdateQuestion";
import { AdminDashboard } from "../components/pages/quiz/AdminDashboard";
import { AdminDeleteQuiz } from "../components/pages/quiz/AdminDeleteQuiz";
import { AdminDeleteQuestion } from "../components/pages/question/AdminDeleteQuestion";
import { AdminDuplicateQuiz } from "../components/pages/quiz/AdminDuplicateQuiz";
import { AdminShowQuiz } from "../components/pages/quiz/AdminShowQuiz";
import { AdminHideQuiz } from "../components/pages/quiz/AdminHideQuiz";
import { AdminRankingView } from "../components/pages/ranking/AdminRankingView";

export const AdminRoutes: React.FC = () => {
  const routes: TRoute = {
    title: "Admin",
    pages: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: "/a/dashboard",
        showInSidebar: true,
        element: <AdminDashboard />,
      },
      {
        title: "Quizzes",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes",
        showInSidebar: true,
        element: <AdminQuizView />,
      },
      {
        title: "Rankings",
        icon: <Trophy className="h-4 w-4" />,
        path: "/a/rankings",
        showInSidebar: true,
        element: <AdminRankingView />,
      },
      {
        title: "New Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/new",
        showInSidebar: false,
        element: <AdminPostQuiz />,
      },
      {
        title: "Edit Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/edit",
        showInSidebar: false,
        element: <AdminQuizUpdate />,
      },
      {
        title: "Quiz Attemptability",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/attempt",
        showInSidebar: false,
        element: <AdminQuizAttemptUpdate />,
      },
      {
        title: "Show Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/show",
        showInSidebar: false,
        element: <AdminShowQuiz />,
      },
      {
        title: "Hide Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/hide",
        showInSidebar: false,
        element: <AdminHideQuiz />,
      },
      {
        title: "Questions",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/questions",
        showInSidebar: false,
        element: <AdminViewQuestions />,
      },
      {
        title: "New Question",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/questions/new",
        showInSidebar: false,
        element: <AdminPostQuestion />,
      },
      {
        title: "Edit Question",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/questions/:questionID/edit",
        showInSidebar: false,
        element: <AdminUpdateQuestion />,
      },
      {
        title: "Delete Question",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/questions/:questionID/delete",
        showInSidebar: false,
        element: <AdminDeleteQuestion />,
      },
      {
        title: "Delete Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/delete",
        showInSidebar: false,
        element: <AdminDeleteQuiz />,
      },
      {
        title: "Duplicate Quiz",
        icon: <FileQuestion className="h-4 w-4" />,
        path: "/a/quizzes/:quizID/duplicate",
        showInSidebar: false,
        element: <AdminDuplicateQuiz />,
      },
      {
        title: "Settings",
        icon: <Settings className="h-4 w-4" />,
        path: "/a/settings",
        showInSidebar: true,
        element: <div>Admin Settings</div>,
      },

      // Page Not Found - Wildcard Route
      {
        title: "Page Not Found",
        icon: <XCircle className="h-4 w-4" />,
        path: "/*",
        showInSidebar: false,
        element: <PageNotFound />,
      },
    ],
  };
  return (
    <Fragment>
      <DashboardLayout routes={routes}>
        <Routes>{renderRoutes(routes.pages)}</Routes>
      </DashboardLayout>
    </Fragment>
  );
};
