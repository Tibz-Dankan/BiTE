import React, { useMemo } from "react";
import type { TSiteVisit } from "../../types/siteVisit";
import { truncateString } from "../../utils/truncateString";
import { AppDate } from "../../utils/appDate";
import { decodeBase64 } from "../../utils/decodeBase64";
import type { TLocationInfo } from "../../types/location";
import {
  Monitor,
  MapPin,
  Globe,
  Clock,
  Calendar,
  Layers,
  Link2,
} from "lucide-react";

interface UserSiteVisitCardProps {
  siteVisit: TSiteVisit;
}

export const UserSiteVisitCard: React.FC<UserSiteVisitCardProps> = ({
  siteVisit,
}) => {
  const {
    user,
    location,
    device,
    page,
    path,
    createdAt: visitCreatedAt,
  } = siteVisit;

  const userCreatedAt = useMemo(
    () => (user ? new AppDate(user.createdAt) : null),
    [user]
  );
  const siteVisitDate = useMemo(
    () => new AppDate(visitCreatedAt),
    [visitCreatedAt]
  );

  const locationInfo = useMemo(() => {
    if (location?.info) {
      return decodeBase64<TLocationInfo>(location.info);
    }
    return null;
  }, [location]);

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        {/* User Details */}
        <div className="w-full relative z-10 flexs items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex-shrink-0 h-8 w-8 rounded-full flex 
              items-center justify-center"
              style={{ backgroundColor: user.profileBgColor }}
            >
              <span className="font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-start font-medium text-gray-800">
                {truncateString(user.name, 18)}
              </p>
              <p
                className="text-[10px] text-start text-gray-500 flex items-center 
                gap-1 font-normal"
              >
                {truncateString(user.email, 36)}
              </p>
            </div>
          </div>

          {userCreatedAt && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400 whitespace-nowrap mt-2">
              <Calendar className="w-3 h-3" />
              <span>
                Joined: {userCreatedAt.monthDayYear()} {userCreatedAt.time()}
              </span>
            </div>
          )}
        </div>

        {/* Visit Details */}
        <div className="grid grid-cols-1 gap-3 mt-1">
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Monitor className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Device
              </span>
              <span className="text-xs text-gray-800 ml-auto font-medium">
                {device}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Page
              </span>
              <span className="text-xs text-gray-800 ml-auto font-medium">
                {truncateString(page, 24)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Link2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Path
              </span>
              <span
                className="text-xs text-gray-800 ml-auto font-medium"
                title={path}
              >
                {truncateString(path, 24)}
              </span>
            </div>
          </div>

          {/* Location Info */}
          {locationInfo && (
            <div className="bg-blue-50/50 rounded-lg p-3 space-y-2 border border-blue-100/50">
              <div className="flex items-center gap-2 text-blue-800">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Location
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-600 uppercase font-semibold">
                    City / Country
                  </span>
                  <span className="text-[11px] text-gray-800 font-medium">
                    {locationInfo.city || "Unknown"},{" "}
                    {locationInfo.country || "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-600 uppercase font-semibold">
                    IP Address
                  </span>
                  <span className="text-[11px] text-gray-800 font-medium">
                    {locationInfo.query}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-600 uppercase font-semibold">
                    ISP
                  </span>
                  <span
                    className="text-[11px] text-gray-800 font-medium truncate"
                    title={locationInfo.isp}
                  >
                    {locationInfo.isp || "Unknown"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-600 uppercase font-semibold">
                    Status
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      locationInfo.status === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {locationInfo.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Clock className="w-3 h-3 text-(--primary)" />
            <span>
              Captured: {siteVisitDate.monthDayYear()} {siteVisitDate.time()}
            </span>
          </div>
          {locationInfo?.timezone && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Globe className="w-3 h-3" />
              <span>{locationInfo.timezone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
