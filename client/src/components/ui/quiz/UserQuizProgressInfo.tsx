import { useEffect, useState } from "react";
import { Button } from "../shared/Btn";
import { useQuery } from "@tanstack/react-query";
import { AlertCard } from "../shared/AlertCard";
import { Gift, Loader2, ChevronRight } from "lucide-react";
import { quizAPI } from "../../../api/quiz";
import { useAuthStore } from "../../../stores/auth";
import type { TQuizUserProgressCount } from "../../../types/quiz";
import { Link, useNavigate } from "react-router-dom";
import { useFeatureFlagEnabled } from "@posthog/react";
import { satsRewardAPI } from "../../../api/satsReward";

export const UserQuizProgressInfo: React.FC = () => {
  const [quizProgressStatus, setQuizProgressStatus] = useState("IN_PROGRESS");
  const user = useAuthStore((state) => state.auth.user);
  const navigate = useNavigate();
  const isSatsRewardEnabled = useFeatureFlagEnabled("sats-reward");

  const {
    data: quizUserProgressData,
    isPending: isPendingQuizUserProgress,
    isError: isErrorQuizUserProgress,
    error: errorQuizUserProgress,
  } = useQuery({
    queryKey: ["quiz-user-progress", user.id, quizProgressStatus],
    queryFn: () => quizAPI.getQuizUserProgressCount({ userID: user.id }),
  });

  const quizUserProgressCount: TQuizUserProgressCount =
    quizUserProgressData?.data ?? {};

  const {
    isPending: isPendingUserSatsRewardStats,
    isError: isErrorUserSatsRewardStats,
    data: userSatsRewardStatsData,
    error: errorUserSatsRewardStats,
  } = useQuery({
    queryKey: ["userSatsRewardStats", user.id],
    queryFn: () => satsRewardAPI.getUserStats({ userID: user.id }),
  });

  const statsData = userSatsRewardStatsData?.data ?? {
    totalSatsToBeClaimed: 0,
    totalSatsEarned: 0,
  };
  const hasUnclaimedSats = statsData.totalSatsToBeClaimed > 0;
  const showUnclaimedSatsInfo = hasUnclaimedSats && isSatsRewardEnabled;

  const isPending = isPendingQuizUserProgress || isPendingUserSatsRewardStats;
  const isError = isErrorQuizUserProgress || isErrorUserSatsRewardStats;
  const error = errorQuizUserProgress || errorUserSatsRewardStats;

  const showInProgressInfo =
    quizUserProgressCount.inProgressCount > 0 &&
    quizProgressStatus === "IN_PROGRESS";

  const showCompletedInfo =
    quizUserProgressCount.completedCount > 0 &&
    quizProgressStatus === "COMPLETED";

  const showUnattemptedInfo =
    quizUserProgressCount.unattemptedCount > 0 &&
    !showInProgressInfo &&
    !showCompletedInfo;

  const navigateTo = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (quizUserProgressData?.data?.inProgressCount === 0) {
      setQuizProgressStatus(() => "COMPLETED");
    }
  }, [quizUserProgressData]);

  if (isPending) {
    return (
      <div className="w-full min-h-[10vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[10vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {showUnclaimedSatsInfo && (
        <div
          className="w-full flex flex-col sm:flex-row gap-4
         border border-gray-200 rounded-xl p-4 text-gray-600 bg-gradient-to-r from-gray-50 to-white"
        >
          <div className="w-full flex items-center gap-2">
            <p className="w-full flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0">
                <Gift className="w-4 h-4 text-(--primary)" />
              </span>
              <span>
                Hi {user.name}, 💰 you have{" "}
                <span className="font-semibold text-gray-800">
                  {statsData.totalSatsToBeClaimed} Satoshis
                </span>{" "}
                to be claimed as you reward.{" "}
                <Link
                  to="/rewards"
                  className="text-(--primary) hover:underline"
                >
                  Learn more
                </Link>
              </span>
            </p>
          </div>
          <Button
            type="button"
            onClick={() => navigateTo(`/u/rewards`)}
            className="flex-shrink-0 flex items-center gap-1 px-4 py-2 h-auto
             bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
          >
            Claim
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!showUnclaimedSatsInfo && (
        <div
          className="w-full flex flex-col sm:flex-row gap-4
         border border-gray-200 rounded-xl p-4 text-gray-600 bg-gradient-to-r from-gray-50 to-white"
        >
          {/* InProgressInfo */}
          {showInProgressInfo && (
            <div className="w-full flex items-center gap-2">
              <span className="text-sm">
                Hi {user.name}, ⏳ you have{" "}
                {quizUserProgressCount.inProgressCount} unfinished{" "}
                {quizUserProgressCount.inProgressCount === 1
                  ? "quiz"
                  : "quizzes"}
                . Please continue attempting to complete{" "}
                {quizUserProgressCount.inProgressCount === 1 ? "it" : "them"}
              </span>
            </div>
          )}
          {showInProgressInfo && (
            <Button
              type="button"
              onClick={() => navigateTo(`/u/quizzes?qzpStatus=in_progress`)}
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 h-auto
               bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {/* CompletedInfo */}
          {showCompletedInfo && (
            <div className="w-full flex items-center gap-2">
              <span className="text-sm">
                Hi {user.name}, 🏆 you have{" "}
                {quizUserProgressCount.completedCount} completed{" "}
                {quizUserProgressCount.completedCount === 1
                  ? "quiz"
                  : "quizzes"}
                . Great job! Attempt more quizzes to improve your ranking
              </span>
            </div>
          )}
          {showCompletedInfo && (
            <Button
              type="button"
              onClick={() => navigateTo(`/u/quizzes?qzpStatus=un_attempted`)}
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 h-auto
               bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
            >
              Attempt
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {/* UnattemptedInfo */}
          {showUnattemptedInfo && (
            <div className="w-full flex items-center gap-2">
              <span className="text-sm">
                Hi {user.name}, 📝 you have not attempted any quizzes yet. Start
                attempting quizzes to improve your ranking.
              </span>
            </div>
          )}

          {showUnattemptedInfo && (
            <Button
              type="button"
              onClick={() => navigateTo(`/u/quizzes?qzpStatus=un_attempted`)}
              className="flex-shrink-0 flex items-center gap-1 px-4 py-2 h-auto
               bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
            >
              Start
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
