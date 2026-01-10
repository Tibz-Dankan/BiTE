import React, { useMemo } from "react";
import type { TAdminUser } from "../../../types/user";
import { truncateString } from "../../../utils/truncateString";
import { AppDate } from "../../../utils/appDate";
import { decodeBase64 } from "../../../utils/decodeBase64";
import type { TLocationInfo, TLocation } from "../../../types/location";
import {
  MapPin,
  Clock,
  Calendar,
  Trophy,
  Activity,
  User as UserIcon,
  Shield,
  Eye,
  Timer,
  BookOpen,
  CheckCircle,
  Hash,
} from "lucide-react";

interface UserProfileCardProps {
  user: TAdminUser;
}

const LocationDetails: React.FC<{
  location: TLocation | null;
  title: string;
}> = ({ location, title }) => {
  const locationInfo = useMemo(() => {
    if (location?.info) {
      return decodeBase64<TLocationInfo>(location.info);
    }
    return null;
  }, [location]);

  if (!locationInfo) return null;

  return (
    <div className="bg-blue-50/50 rounded-lg p-3 space-y-2 border border-blue-100/50">
      <div className="flex items-center gap-2 text-blue-800">
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {title}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex flex-col">
          <span className="text-[9px] text-blue-600 uppercase font-semibold">
            City / Country
          </span>
          <span className="text-gray-800 font-medium">
            {locationInfo.city || "Unknown"},{" "}
            {locationInfo.country || "Unknown"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-blue-600 uppercase font-semibold">
            IP Address
          </span>
          <span className="text-gray-800 font-medium">
            {locationInfo.query}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-blue-600 uppercase font-semibold">
            ISP
          </span>
          <span
            className="text-gray-800 font-medium truncate"
            title={locationInfo.isp}
          >
            {locationInfo.isp || "Unknown"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-blue-600 uppercase font-semibold">
            Timezone
          </span>
          <span className="text-gray-800 font-medium">
            {locationInfo.timezone || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const userCreatedAt = useMemo(
    () => new AppDate(user.createdAt),
    [user.createdAt]
  );

  const stats = [
    {
      label: "Rank",
      value: user.rank,
      icon: <Trophy className="w-3.5 h-3.5 text-yellow-500" />,
    },
    {
      label: "Role",
      value: user.role,
      icon: <Shield className="w-3.5 h-3.5 text-purple-500" />,
    },
    {
      label: "Score",
      value: `${user.scorePercentage.toFixed(1)}%`,
      icon: <Activity className="w-3.5 h-3.5 text-green-500" />,
    },
    {
      label: "Sessions",
      value: user.totalSessionsCount,
      icon: <Hash className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      label: "Visits",
      value: user.siteVisitsCount,
      icon: <Eye className="w-3.5 h-3.5 text-cyan-500" />,
    },
    {
      label: "Duration",
      value: `${Math.round(user.totalAttemptDuration / 60)}m`,
      icon: <Timer className="w-3.5 h-3.5 text-orange-500" />,
    },
    {
      label: "Quiz Attempts",
      value: user.userQuizAttemptCount,
      icon: <BookOpen className="w-3.5 h-3.5 text-indigo-500" />,
    },
    {
      label: "Total Qs",
      value: user.questionAttemptCount,
      icon: <Hash className="w-3.5 h-3.5 text-gray-500" />,
    },
    {
      label: "Correct Qs",
      value: user.correctQuestionAttemptCount,
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header Profile Info */}
      <div className="w-full relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex-shrink-0 h-10 w-10 rounded-full flex 
            items-center justify-center shadow-inner"
            style={{ backgroundColor: user.profileBgColor }}
          >
            <span className="font-semibold text-white text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-start font-bold text-gray-800">
              {truncateString(user.name, 22)}
            </p>
            <p className="text-[10px] text-start text-gray-500 flex items-center gap-1 font-normal">
              {truncateString(user.email, 30)}
            </p>
          </div>
        </div>
        <div className="text-right flex items-center justify-start gap-2 mt-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <span>Joined: </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{userCreatedAt.monthDayYear()}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{userCreatedAt.time()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg p-2 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-1">{stat.icon}</div>
            <span className="text-[9px] text-gray-500 uppercase font-semibold block leading-tight">
              {stat.label}
            </span>
            <span className="text-[11px] font-bold text-gray-800 block">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Locations and Sessions */}
      <div className="space-y-3 mt-auto">
        {user.lastLocation && (
          <LocationDetails
            location={user.lastLocation}
            title="Last Known Location"
          />
        )}

        {user.lastSession && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-gray-700 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <span>Last Session</span>
              </div>
              <span className="text-gray-500 font-medium">
                {new AppDate(user.lastSession.createdAt).monthDayYear()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <UserIcon className="w-3 h-3" />
              <span className="font-medium">Device:</span>
              <span className="truncate flex-1 text-right">
                {user.lastSession.device}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <Shield className="w-3 h-3" />
              <span className="font-medium">Method:</span>
              <span className="text-right ml-auto uppercase text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                {user.lastSession.generatedVia}
              </span>
            </div>

            {user.lastSession.location && (
              <div className="mt-2 pt-2 border-t border-gray-200/60">
                <LocationDetails
                  location={user.lastSession.location}
                  title="Session Location"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
