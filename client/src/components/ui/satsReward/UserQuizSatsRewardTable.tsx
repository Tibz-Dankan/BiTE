import React from "react";
import type { SatsReward } from "../../../types/satsReward";
import { SatsRewardStatusBadge } from "./SatsRewardStatusBadge";
import { decodeBase64 } from "../../../utils/decodeBase64";
import { removeMinusCharPrefix } from "../../../utils/removeMinusCharPrefix";
import { formatDate } from "../../../utils/formatDate";
import { Trophy } from "lucide-react";

interface UserQuizSatsRewardTableProps {
  rewards: SatsReward[];
}

export const UserQuizSatsRewardTable: React.FC<
  UserQuizSatsRewardTableProps
> = ({ rewards }) => {
  const getTotalSats = (reward: SatsReward) => {
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

  return (
    <div className="rounded-2xl border border-slate-100 shadow-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Quiz
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Sats Earned
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Payout Address
              </th>
            </tr>
          </thead>
          <tbody>
            {rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No rewards yet
                </td>
              </tr>
            ) : (
              rewards.map((reward) => (
                <tr
                  key={reward.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm align-middle">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                        <Trophy size={18} />
                      </div>
                      <span
                        className="font-semibold text-slate-800 truncate max-w-[180px]"
                        title={reward.quiz?.title}
                      >
                        {reward.quiz?.title || "Quiz Reward"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm align-middle text-slate-600 whitespace-nowrap">
                    {formatDate(reward.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-sm align-middle">
                    <SatsRewardStatusBadge status={reward.status} />
                  </td>
                  <td className="px-4 py-4 text-sm align-middle whitespace-nowrap">
                    <span className="text-base font-bold text-slate-900">
                      {getTotalSats(reward)}
                    </span>{" "}
                    <span className="text-xs font-normal text-slate-500">
                      Sats
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 align-middle font-mono text-xs text-slate-600 truncate max-w-[200px]"
                    title={reward.satsRewardAddress?.address}
                  >
                    {reward.satsRewardAddress?.address || "No address"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
