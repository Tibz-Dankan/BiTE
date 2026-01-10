import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { rankingAPI } from "../../../api/ranking";
import type { TRanking } from "../../../types/ranking";
import type { TPagination } from "../../../types/pagination";
import { ArrowLeft, ArrowRight, Loader2, Trophy } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { UserRankingCard } from "../../ranking/UserRankingCard";
import { Button } from "../shared/Btn";

export const AdminRankingList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("rkCursor") || "";
  const hasCursor: boolean = !!cursor;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-ranking-view-${cursor}`],
    queryFn: () => rankingAPI.getUsersWithRanks(20, cursor),
  });

  const rankings: TRanking[] = data?.data ?? [];
  const pagination: TPagination = data?.pagination ?? {
    count: 0,
    limit: 20,
    hasNextItems: false,
    nextCursor: "",
  };

  const hasMoreRankings: boolean = pagination.hasNextItems;
  const disableNextBtn: boolean = isPending || !hasMoreRankings;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isPending && hasCursor;

  const loadNextRankingsHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("rkCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false }
    );
  };

  const loadPrevRankingsHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  if (isPending && !hasCursor) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-(--primary)" />
          <span className="text-gray-800 text-sm font-medium">
            Loading rankings...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <AlertCard
          type={"error"}
          message={error ? error.message : "Failed to load rankings"}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Trophy className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Rankings</h2>
            <p className="text-sm text-gray-500">
              Track and visualize user performance across all quizzes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankings.map((ranking) => (
          <UserRankingCard key={ranking.id} ranking={ranking} />
        ))}
      </div>

      {/* Empty State */}
      {rankings.length === 0 && !isPending && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4 text-gray-300">
            <Trophy className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No rankings found
          </h3>
          <p className="text-gray-500 text-sm">
            There are no user rankings to display at the moment.
          </p>
        </div>
      )}

      {/* Pagination action */}
      <div className="w-full flex items-center justify-end gap-4 pt-4">
        <Button
          type={"button"}
          disabled={disablePrevBtn}
          className="min-w-[100px] bg-white border border-gray-200
           text-gray-700 hover:bg-gray-50 disabled:opacity-50 h-auto py-2.5 px-4 shadow-sm"
          onClick={() => loadPrevRankingsHandler()}
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Previous</span>
          </div>
        </Button>
        <Button
          type={"button"}
          disabled={disableNextBtn}
          className="min-w-[100px] bg-white border border-gray-200
           text-gray-700 hover:bg-gray-50 disabled:opacity-50 h-auto py-2.5 px-4 shadow-sm"
          onClick={() => loadNextRankingsHandler()}
        >
          <>
            {!showNextLoader && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium">Next</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
            {showNextLoader && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            )}
          </>
        </Button>
      </div>
    </div>
  );
};
