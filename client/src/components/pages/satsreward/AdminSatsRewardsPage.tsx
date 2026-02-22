import React from "react";
import { useQuery } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { AdminSatsRewardCard } from "../../ui/satsReward/AdminSatsRewardCard";
import { AlertCard } from "../../ui/shared/AlertCard";
import { Pagination } from "../../ui/shared/Pagination";
import { Loader2, Bitcoin } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const AdminSatsRewardsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cursor = searchParams.get("cursor") || "";

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["adminSatsRewards", cursor],
    queryFn: () => satsRewardAPI.getAll({ limit: 20, cursor }),
  });

  const loadNextPage = () => {
    if (data?.pagination.hasNextItems) {
      setSearchParams({ cursor: data.pagination.nextCursor });
    }
  };

  const loadPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-full p-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-2xl text-white">
            <Bitcoin size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercases tracking-tight">
              Reward Master
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and oversea all bitcoin rewards across the platform
            </p>
          </div>
        </div>
      </div>

      {isPending ? (
        <div
          className="w-full flex flex-col items-center justify-center py-32
          bg-white rounded-3xl border border-slate-100 shadow-sm"
        >
          <Loader2 className="h-10 w-10 animate-spin text-(--primary) mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Fetching rewards data...
          </p>
        </div>
      ) : isError ? (
        <AlertCard type="error" message={error.message} />
      ) : data?.data.length === 0 ? (
        <div
          className="text-center py-32 bg-white rounded-3xl border
          border-slate-200 shadow-sm flex flex-col items-center"
        >
          <div
            className="w-20 h-20 bg-slate-50 rounded-full flex
            items-center justify-center mb-6"
          >
            <Bitcoin size={40} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            No Reward records found
          </h3>
          <p className="text-slate-500 mt-2 max-w-xs">
            There are currently no rewards recorded in the system.
          </p>
        </div>
      ) : (
        <div className="space-y-10 pb-10">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3ss
            xl:grid-cols-4 gap-6"
          >
            {data?.data.map((reward) => (
              <AdminSatsRewardCard key={reward.id} reward={reward} />
            ))}
          </div>

          <Pagination
            disablePrev={!cursor}
            disableNext={!data?.pagination.hasNextItems}
            onPrev={loadPrevPage}
            onNext={loadNextPage}
            isLoadingNext={isPending && !!cursor}
          />
        </div>
      )}
    </div>
  );
};
