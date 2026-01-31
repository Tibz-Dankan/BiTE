import React from "react";
import { UserAnalytics } from "../../ui/quiz/UserAnalytics";
import { UserQuizProgressInfo } from "../../ui/quiz/UserQuizProgressInfo";

export const UserDashboard: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      <UserQuizProgressInfo />
      <UserAnalytics />
    </div>
  );
};
