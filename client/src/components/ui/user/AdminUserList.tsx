import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userAPI } from "../../../api/user";
import type { TAdminUser } from "../../../types/user";
import type { TPagination } from "../../../types/pagination";
import { ArrowLeft, ArrowRight, Loader2, Users } from "lucide-react";
import { AlertCard } from "../shared/AlertCard";
import { UserProfileCard } from "./UserProfileCard";
import { Button } from "../shared/Btn";

export const AdminUserList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cursor = searchParams.get("uCursor") || "";
  const hasCursor: boolean = !!cursor;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`admin-user-list-view-${cursor}`],
    queryFn: () => userAPI.getAll(12, cursor),
  });

  const users: TAdminUser[] = data?.data ?? [];
  const pagination: TPagination = data?.pagination ?? {
    count: 0,
    limit: 12,
    hasNextItems: false,
    nextCursor: "",
  };

  const hasMoreUsers: boolean = pagination.hasNextItems;
  const disableNextBtn: boolean = isPending || !hasMoreUsers;
  const disablePrevBtn: boolean = !hasCursor;
  const showNextLoader: boolean = isPending && hasCursor;

  const loadNextUsersHandler = () => {
    setSearchParams(
      (prev) => {
        prev.set("uCursor", pagination!.nextCursor);
        return prev;
      },
      { replace: false }
    );
  };

  const loadPrevUsersHandler = () => {
    if (!cursor) return;
    navigate(-1);
  };

  if (isPending && !hasCursor) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-(--primary)" />
          <span className="text-gray-800 text-sm font-medium">
            Loading users...
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
          message={error ? error.message : "Failed to load users"}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Platform Users</h2>
            <p className="text-sm text-gray-500">
              Manage and monitor user performance and activity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserProfileCard key={user.id} user={user} />
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && !isPending && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4 text-gray-300">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No users found
          </h3>
          <p className="text-gray-500 text-sm">
            There are no users to display at the moment.
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
          onClick={() => loadPrevUsersHandler()}
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
          onClick={() => loadNextUsersHandler()}
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
