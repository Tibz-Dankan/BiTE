import { useQuery } from "@tanstack/react-query";
import React from "react";
import { analyticsAPI } from "../../../api/analytics";
import { addCommasToNumber } from "../../../utils/addCommasToNumber";
import {
  Loader2,
  FileText,
  HelpCircle,
  MessageSquare,
  Users,
  Clock,
  Trophy,
  Globe,
  MonitorPlay,
  UserCheck,
} from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { Card } from "../shared/Card";

export const AdminAnalytics: React.FC = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => analyticsAPI.getAdmin(),
  });

  const analyticsData = data?.data ?? {
    averageCorrectScore: 0,
    averageCorrectScorePerQuiz: 0,
    totalAnswers: 0,
    totalAttemptDuration: 0,
    totalQuizzesAttempted: 0,
    totalQuestionsAttempted: 0,
    totalQuestions: 0,
    totalQuizzes: 0,
    totalSiteVisits: 0,
    totalUserSessions: 0,
    totalUsers: 0,
  };

  const getValue = (valueInt: number) => {
    if (!valueInt) return "";
    return addCommasToNumber(valueInt);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (isPending) {
    return (
      <div className="w-full h-[20vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[20vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: getValue(analyticsData.totalUsers),
      icon: <Users className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Quizzes",
      value: getValue(analyticsData.totalQuizzes),
      icon: <FileText className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Questions",
      value: getValue(analyticsData.totalQuestions),
      icon: <HelpCircle className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Answers",
      value: getValue(analyticsData.totalAnswers),
      icon: <MessageSquare className="text-primary w-5 h-5 text-(--primary)" />,
    },
    // {
    //   label: "Global Avg Score",
    //   value: `${analyticsData.averageCorrectScore.toFixed(1)}%`,
    //   icon: <Trophy className="text-primary w-5 h-5 text-(--primary)" />,
    // },
    {
      label: "Avg Score / Quiz",
      value: `${analyticsData.averageCorrectScorePerQuiz.toFixed(1)}%`,
      icon: <Trophy className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Quizzes Attempted",
      value: getValue(analyticsData.totalQuizzesAttempted),
      icon: <MonitorPlay className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Questions Attempted",
      value: getValue(analyticsData.totalQuestionsAttempted),
      icon: <MonitorPlay className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Duration",
      value: formatDuration(analyticsData.totalAttemptDuration),
      icon: <Clock className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Site Visits",
      value: getValue(analyticsData.totalSiteVisits),
      icon: <Globe className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "User Sessions",
      value: getValue(analyticsData.totalUserSessions),
      icon: <UserCheck className="text-primary w-5 h-5 text-(--primary)" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="flex flex-col justify-between gap-4 w-full
          border-[1px] border-gray-300 shadow-none min-h-32"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-500">{card.label}</p>
            <span className="text-color-text-primary bg-(--primary)/15 rounded-md p-2">
              {card.icon}
            </span>
          </div>
          <div className="flex flex-col gap-2 text-gray-800">
            <p className="font-semibold text-3xl">{card.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
