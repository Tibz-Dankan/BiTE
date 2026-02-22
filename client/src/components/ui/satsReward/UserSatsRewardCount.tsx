import { useQuery } from "@tanstack/react-query";
import React from "react";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { addCommasToNumber } from "../../../utils/addCommasToNumber";
import { Loader2, Coins, Gift } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { Card } from "../shared/Card";

export const UserSatsRewardCount: React.FC = () => {
  const user = useAuthStore((state) => state.auth.user);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userSatsRewardStats", user.id],
    queryFn: () => satsRewardAPI.getUserStats({ userID: user.id }),
  });

  const statsData = data?.data ?? {
    totalSatsToBeClaimed: 0,
    totalSatsEarned: 0,
  };

  const getValue = (valueInt: number) => {
    if (!valueInt) return "0";
    return addCommasToNumber(valueInt);
  };

  if (isPending) {
    return (
      <div className="w-full h-[20vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
          <p className="text-slate-500 text-sm">Loading stats...</p>
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
      label: "Sats To Be Claimed",
      value: getValue(statsData.totalSatsToBeClaimed),
      icon: <Coins className="text-primary w-5 h-5 text-(--primary)" />,
    },
    {
      label: "Sats Rewarded",
      value: getValue(statsData.totalSatsEarned),
      icon: <Gift className="text-primary w-5 h-5 text-(--primary)" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
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
