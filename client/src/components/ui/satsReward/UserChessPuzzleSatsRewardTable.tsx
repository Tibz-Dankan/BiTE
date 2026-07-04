import React from "react";
import type { TChessPuzzleSatsReward } from "../../../types/chessPuzzle";
import { SatsRewardStatusBadge } from "./SatsRewardStatusBadge";
import { decodeBase64 } from "../../../utils/decodeBase64";
import { removeMinusCharPrefix } from "../../../utils/removeMinusCharPrefix";
import { formatDate } from "../../../utils/formatDate";
import { Puzzle } from "lucide-react";

interface UserChessPuzzleSatsRewardTableProps {
  rewards: TChessPuzzleSatsReward[];
}

export const UserChessPuzzleSatsRewardTable: React.FC<
  UserChessPuzzleSatsRewardTableProps
> = ({ rewards }) => {
  const getSats = (reward: TChessPuzzleSatsReward) => {
    if (!reward.transaction) return 0;

    let amount = 0;
    if (typeof reward.transaction === "string") {
      const decoded = decodeBase64<{ settlementAmount: number }>(
        reward.transaction,
      );
      if (decoded && decoded.settlementAmount) {
        amount = removeMinusCharPrefix(decoded.settlementAmount);
      }
    } else if (reward.transaction.settlementAmount) {
      amount = removeMinusCharPrefix(reward.transaction.settlementAmount);
    }
    return amount;
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
                Puzzle ID
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
                        <Puzzle size={18} />
                      </div>
                      <span
                        className="font-mono text-xs text-slate-600 truncate max-w-[200px]"
                        title={reward.chessPuzzleID}
                      >
                        {reward.chessPuzzleID}
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
                      {getSats(reward)}
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
