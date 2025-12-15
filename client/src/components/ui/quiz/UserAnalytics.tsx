import { useQuery } from "@tanstack/react-query";
import React from "react";
import { analyticsAPI } from "../../../api/analytics";
import { addCommasToNumber } from "../../../utils/addCommasToNumber";
import {
  Loader2,
  FileText,
  MonitorPlay,
  Clock,
  Trophy,
  Medal,
} from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { Card } from "../shared/Card";

export const UserAnalytics: React.FC = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-analytics"],
    queryFn: () => analyticsAPI.getUser(),
  });

  const analyticsData = data?.data ?? {
    averageAttemptDuration: 0,
    averageCorrectScore: 0,
    rank: 0,
    totalAttemptDuration: 0,
    totalQuestionsAttempted: 0,
    totalQuizzesAttempted: 0,
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
      label: "My Rank",
      value: `#${getValue(analyticsData.rank)}`,
      icon: <Medal className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Quizzes Attempted",
      value: getValue(analyticsData.totalQuizzesAttempted),
      icon: <FileText className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Questions Attempted",
      value: getValue(analyticsData.totalQuestionsAttempted),
      icon: <MonitorPlay className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Average Score",
      value: `${analyticsData.averageCorrectScore.toFixed(1)}%`,
      icon: <Trophy className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Total Duration",
      value: formatDuration(analyticsData.totalAttemptDuration),
      icon: <Clock className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Avg Duration / Quiz",
      value: formatDuration(analyticsData.averageAttemptDuration),
      icon: <Clock className="text-primary w-5 h-5 text-(--primary)" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
