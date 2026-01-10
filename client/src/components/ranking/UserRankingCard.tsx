import React from "react";
import type { TRanking } from "../../types/ranking";
import { truncateString } from "../../utils/truncateString";
import { AppDate } from "../../utils/appDate";
import { Clock, RotateCcw, CheckCircle2, Trophy, Calendar } from "lucide-react";

interface UserRankingCardProps {
  ranking: TRanking;
}

export const UserRankingCard: React.FC<UserRankingCardProps> = ({
  ranking,
}) => {
  const { user } = ranking;
  const createdAt = new AppDate(user.createdAt);
  const updatedAt = new AppDate(ranking.updatedAt);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* User Details */}
        <div className="w-full relative z-10 flexs items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex-shrink-0 h-10 w-10 rounded-full flex 
              items-center justify-center text-white font-semibold"
              style={{ backgroundColor: user.profileBgColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-start font-medium text-gray-800">
                {truncateString(user.name, 18)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p
                  className="text-[10px] text-start text-gray-500 flex items-center 
                  gap-1 font-normal"
                >
                  {truncateString(user.email, 36)}
                </p>
              </div>
            </div>
          </div>

          {/* Joined */}
          <div
            className="flex items-center gap-1 text-[10px] text-gray-400 whitespace-nowrap
            mt-2"
          >
            <Calendar className="w-3 h-3" />
            <span>
              Joined: {createdAt.monthDayYear()} {createdAt.time()}
            </span>
          </div>
        </div>

        {/* Ranking Details */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Rank
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              # {ranking.rank}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Duration
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {ranking.totalDuration}s
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500">
              <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Attempts
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {ranking.totalAttempts}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Correct
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {ranking.totalCorrectAttempts}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" />
            <span>
              Last Updated: {updatedAt.monthDayYear()} {updatedAt.time()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
