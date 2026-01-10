import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { siteVisitAPI } from "../../../api/siteVisit";
import type { TSiteVisit } from "../../../types/siteVisit";
import type { TPagination } from "../../../types/pagination";
import { ArrowLeft, ArrowRight, Loader2, Eye } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { UserSiteVisitCard } from "../../siteVisit/UserSiteVisitCard";
import { Button } from "../shared/Btn";

export const AdminSiteVisitList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("svCursor") || "";
  const hasCursor: boolean = !!cursor;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-site-visit-view-${cursor}`],
    queryFn: () => siteVisitAPI.getAll(20, cursor),
  });

  const siteVisits: TSiteVisit[] = data?.data ?? [];
  const pagination: TPagination = data?.pagination ?? {
    count: 0,
    limit: 20,
    hasNextItems: false,
    nextCursor: "",
  };

  const hasMoreVisits: boolean = pagination.hasNextItems;
  const disableNextBtn: boolean = isPending || !hasMoreVisits;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isPending && hasCursor;

  const loadNextVisitsHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("svCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false }
    );
  };

  const loadPrevVisitsHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  if (isPending && !hasCursor) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-(--primary)" />
          <span className="text-gray-800 text-sm font-medium">
            Loading site visits...
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
          message={error ? error.message : "Failed to load site visits"}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Site Visits</h2>
            <p className="text-sm text-gray-500">
              Monitor user activity and navigation across the platform
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteVisits.map((visit) => (
          <UserSiteVisitCard key={visit.id} siteVisit={visit} />
        ))}
      </div>

      {/* Empty State */}
      {siteVisits.length === 0 && !isPending && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4 text-gray-300">
            <Eye className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No site visits found
          </h3>
          <p className="text-gray-500 text-sm">
            There are no user site visits to display at the moment.
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
          onClick={() => loadPrevVisitsHandler()}
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
          onClick={() => loadNextVisitsHandler()}
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
