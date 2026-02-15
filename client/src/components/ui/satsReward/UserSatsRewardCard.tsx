import React from "react";
import type { SatsReward } from "../../../types/satsReward";
import {
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  Bitcoin,
  Gift,
} from "lucide-react";
import { decodeBase64 } from "../../../utils/decodeBase64";
import { removeMinusCharPrefix } from "../../../utils/removeMinusCharPrefix";
import { formatDate } from "../../../utils/formatDate";

interface UserSatsRewardCardProps {
  reward: SatsReward;
}

export const UserSatsRewardCard: React.FC<UserSatsRewardCardProps> = ({
  reward,
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "PENDING":
        return {
          label: "Pending",
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-100",
        };
      case "FAILED":
        return {
          label: "Failed",
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: "text-slate-600",
          bgColor: "bg-slate-100",
        };
    }
  };

  const statusInfo = getStatusInfo(reward.status);
  const StatusIcon = statusInfo.icon;

  const getTotalSats = () => {
    if (!reward.satsRewardTransactions) return 0;

    return reward.satsRewardTransactions.reduce((acc, tx) => {
      let amount = 0;
      if (typeof tx.transaction === "string") {
        const decoded = decodeBase64<{ settlementAmount: number }>(
          tx.transaction,
        );
        if (decoded && decoded.settlementAmount) {
          amount = removeMinusCharPrefix(decoded.settlementAmount);
        }
      } else if (tx.transaction && tx.transaction.settlementAmount) {
        amount = removeMinusCharPrefix(tx.transaction.settlementAmount);
      }
      return acc + amount;
    }, 0);
  };

  const totalSats = getTotalSats();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Bitcoin className="text-indigo-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                {reward.quiz?.title || "Quiz Reward"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500">
                  {formatDate(reward.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}
          >
            <StatusIcon size={14} className={statusInfo.color} />
            <span className={`text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Gift size={16} className="text-(--primary)" />
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Reward
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {totalSats}{" "}
              <span className="text-sm font-medium text-slate-500">Sats</span>
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Layers size={16} className="text-indigo-500" />
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Payout Address
              </span>
            </div>
            <p
              className="text-sm font-medium text-slate-700 truncate"
              title={reward.satsRewardAddress?.address}
            >
              {reward.satsRewardAddress?.address || "No address"}
            </p>
          </div>
        </div>

        {reward.satsRewardTransactions &&
          reward.satsRewardTransactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">
                Transaction Details
              </p>
              <div className="flex flex-wrap gap-2">
                {reward.satsRewardTransactions.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded"
                  >
                    TX #{idx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
