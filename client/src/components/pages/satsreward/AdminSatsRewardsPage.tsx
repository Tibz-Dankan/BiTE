import React from "react";
import { useQuery } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { AdminSatsRewardCard } from "../../ui/satsReward/AdminSatsRewardCard";
import { AlertCard } from "../../ui/shared/AlertCard";
import { Button } from "../../ui/shared/Btn";
import { Loader2, ArrowLeft, ArrowRight, Bitcoin, Search } from "lucide-react";
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
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
              Reward Master
            </h1>
            <p className="text-slate-500 font-medium">
              Manage and oversea all bitcoin rewards across the platform
            </p>
          </div>
        </div>

        <div className="relative group max-w-xs w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400
            group-focus-within:text-(--primary) transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search rewards..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200
            rounded-2xl outline-none focus:ring-2 ring-indigo-500/10 focus:border-(--primary)
            transition-all"
          />
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4 gap-6"
          >
            {data?.data.map((reward) => (
              <AdminSatsRewardCard key={reward.id} reward={reward} />
            ))}
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-end gap-6 pt-6 border-t
            border-slate-100"
          >
            <p className="text-sm font-medium text-slate-400">
              Showing {data?.data.length} results
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={!cursor}
                onClick={loadPrevPage}
                className="bg-white text-slate-700 border border-slate-200
                hover:bg-slate-50 h-11 px-6 shadow-sm disabled:opacity-50"
              >
                <ArrowLeft size={18} className="mr-2" /> Prev
              </Button>
              <Button
                type="button"
                disabled={!data?.pagination.hasNextItems}
                onClick={loadNextPage}
                className="bg-white text-slate-700 border border-slate-200
                hover:bg-slate-50 h-11 px-6 shadow-sm disabled:opacity-50"
              >
                Next <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
