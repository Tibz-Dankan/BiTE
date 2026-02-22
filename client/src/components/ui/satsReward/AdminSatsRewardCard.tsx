import React from "react";
import type { SatsReward } from "../../../types/satsReward";
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Bitcoin,
  User as UserIcon,
  Mail,
  // ExternalLink,
} from "lucide-react";
import { decodeBase64 } from "../../../utils/decodeBase64";
import { removeMinusCharPrefix } from "../../../utils/removeMinusCharPrefix";
import { formatDate } from "../../../utils/formatDate";

interface AdminSatsRewardCardProps {
  reward: SatsReward;
}

export const AdminSatsRewardCard: React.FC<AdminSatsRewardCardProps> = ({
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
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 capitalize">
              <Bitcoin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 line-clamp-1">
                {reward.quiz?.title || "Quiz Reward"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
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

        <div className="flex flex-col gap-4">
          {/* User Details */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{
                  backgroundColor: reward.user?.profileBgColor || "#6366f1",
                }}
              >
                {reward.user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <UserIcon size={14} className="text-slate-400" />
                  <p className="text-sm font-bold text-slate-800">
                    {reward.user?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <p className="text-xs text-slate-500">{reward.user?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  Amount
                </p>
                <p className="text-base font-bold text-slate-900">
                  {totalSats} <span className="text-xs font-normal">Sats</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  Address
                </p>
                <p
                  className="text-sm font-bold text-slate-700 truncate"
                  title={reward.satsRewardAddress?.address}
                >
                  {reward.satsRewardAddress?.address || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Operations/Logs */}
          {reward.satsRewardOperations &&
            reward.satsRewardOperations.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">
                  Latest Operations
                </p>
                {reward.satsRewardOperations.slice(0, 2).map((op) => (
                  <div
                    key={op.id}
                    className="text-xs flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <span
                      className={
                        op.status === "SUCCESS"
                          ? "text-green-600 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      {op.status}
                    </span>
                    <span className="text-slate-500 truncate max-w-[150px]">
                      {op.info}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* <div className="mt-6 flex gap-2">
          <button className="flex-1 py-2 rounded-lg bg-(--primary) text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            Manage Reward
          </button>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
            <ExternalLink size={18} />
          </button>
        </div> */}
      </div>
    </div>
  );
};
