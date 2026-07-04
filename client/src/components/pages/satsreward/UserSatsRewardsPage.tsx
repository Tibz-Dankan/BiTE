import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { UserSatsRewardAddressCard } from "../../ui/satsReward/UserSatsRewardAddressCard";
import { UserClaimCard } from "../../ui/satsReward/UserClaimCard";
import { AddSatsRewardAddressModal } from "../../ui/satsReward/AddSatsRewardAddressModal";
import { AlertCard } from "../../ui/shared/AlertCard";
import { Button } from "../../ui/shared/Btn";
import { Pagination } from "../../ui/shared/Pagination";
import { Loader2, Plus, Gift, MapPin, Trophy, Info } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { UserSatsRewardCount } from "../../ui/satsReward/UserSatsRewardCount";
import { UserQuizSatsRewardTable } from "../../ui/satsReward/UserQuizSatsRewardTable";
import { UserChessPuzzleSatsRewardTable } from "../../ui/satsReward/UserChessPuzzleSatsRewardTable";
import { useUserSatsRewards } from "../../../hooks/useUserSatsRewards";
import { useUserChessPuzzleSatsRewards } from "../../../hooks/useUserChessPuzzleSatsRewards";
import { useFeatureFlagEnabled } from "@posthog/react";

export const UserSatsRewardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "claims" | "rewards" | "addresses"
  >("claims");
  const [rewardType, setRewardType] = useState<"quiz" | "puzzle">("quiz");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.auth.user);
  const cursor = searchParams.get("cursor") || "";

  const isChessPuzzleEnabled = useFeatureFlagEnabled("chesspuzzle");
  // Fall back to the quiz view whenever the chess-puzzle flag is off, so the
  // puzzle query never fires and the puzzle branch can never render even if
  // rewardType somehow held "puzzle".
  const effectiveRewardType = isChessPuzzleEnabled ? rewardType : "quiz";

  const {
    data: claimsData,
    isPending: isClaimsPending,
    isError: isClaimsError,
    error: claimsError,
  } = useQuery({
    queryKey: ["claimableQuizzes", user.id, cursor],
    queryFn: () =>
      satsRewardAPI.getClaimableQuizzes({
        userID: user.id,
        limit: 10,
        cursor,
      }),
    enabled: activeTab === "claims",
  });

  const {
    data: quizRewardsData,
    isPending: isQuizRewardsPending,
    isError: isQuizRewardsError,
    error: quizRewardsError,
  } = useUserSatsRewards({
    userID: user.id,
    cursor,
    enabled: activeTab === "rewards" && effectiveRewardType === "quiz",
  });

  const {
    data: puzzleRewardsData,
    isPending: isPuzzleRewardsPending,
    isError: isPuzzleRewardsError,
    error: puzzleRewardsError,
  } = useUserChessPuzzleSatsRewards({
    userID: user.id,
    cursor,
    enabled: activeTab === "rewards" && effectiveRewardType === "puzzle",
  });

  const {
    data: addressesData,
    isPending: isAddressesPending,
    isError: isAddressesError,
    error: addressesError,
  } = useQuery({
    queryKey: ["satsRewardAddresses", user.id],
    queryFn: () =>
      satsRewardAPI.getAddressesByUser({ userID: user.id, limit: 20 }),
    enabled: activeTab === "addresses",
  });

  const loadNextPage = () => {
    if (activeTab === "claims" && claimsData?.pagination.hasNextItems) {
      setSearchParams({ cursor: claimsData.pagination.nextCursor });
    } else if (activeTab === "rewards") {
      if (
        effectiveRewardType === "quiz" &&
        quizRewardsData?.pagination.hasNextItems
      ) {
        setSearchParams({ cursor: quizRewardsData.pagination.nextCursor });
      } else if (
        effectiveRewardType === "puzzle" &&
        puzzleRewardsData?.pagination.hasNextItems
      ) {
        setSearchParams({ cursor: puzzleRewardsData.pagination.nextCursor });
      }
    }
  };

  const selectRewardType = (type: "quiz" | "puzzle") => {
    setRewardType(type);
    setSearchParams({});
  };

  const loadPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div
        className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Rewards</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Check your sats rewards and manage your payout addresses.
          </p>
        </div>
        {activeTab === "addresses" && (
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 px-6"
          >
            <Plus size={18} />
            <span>Add Address</span>
          </Button>
        )}
      </div>
      <UserSatsRewardCount />
      {/* Tabs */}
      <div
        className="w-full sm:w-fit flex flex-col sm:flex-row sm:items-center
        justify-center sm:justify-start items-center gap-1 bg-slate-100 p-1
        rounded-xl mb-8 border border-slate-200"
      >
        <button
          onClick={() => {
            setActiveTab("claims");
            setSearchParams({});
          }}
          className={`w-full sm:w-auto flex items-center justify-center
            gap-2 px-6 py-2.5 rounded-lg text-sm font-bold
            transition-all ${
              activeTab === "claims"
                ? "bg-white text-(--primary) shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <Trophy size={18} />
          <span>Claims</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("rewards");
            setSearchParams({});
          }}
          className={`w-full sm:w-auto flex items-center justify-center
            gap-2 px-6 py-2.5 rounded-lg text-sm font-bold
            transition-all ${
              activeTab === "rewards"
                ? "bg-white text-(--primary) shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <Gift size={18} />
          <span>Rewards</span>
        </button>
        <button
          onClick={() => setActiveTab("addresses")}
          className={`w-full sm:w-auto flex items-center justify-center
            gap-2 px-6 py-2.5 rounded-lg text-sm 
            font-bold transition-all ${
              activeTab === "addresses"
                ? "bg-white text-(--primary) shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <MapPin size={18} />
          <span>Addresses</span>
        </button>
      </div>

      {/* Content */}
      <div className="w-full min-h-[400px]">
        {activeTab === "claims" ? (
          <>
            {isClaimsPending ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
                <p className="text-slate-500 text-sm">
                  Loading claimable quizzes...
                </p>
              </div>
            ) : isClaimsError ? (
              <AlertCard type="error" message={claimsError.message} />
            ) : claimsData?.data === null || claimsData?.data?.length === 0 ? (
              <div
                className="text-center py-20 bg-slate-50 rounded-3xl border-2
                border-dashed border-slate-200"
              >
                <div
                  className="w-16 h-16 bg-slate-100 rounded-full flex
                  items-center justify-center mx-auto mb-4"
                >
                  <Trophy size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No claimable rewards
                </h3>
                <p className="text-slate-500 mt-1">
                  Complete more quizzes to earn sats rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  {claimsData?.data.map((claim) => (
                    <UserClaimCard key={claim.id} claim={claim} />
                  ))}
                </div>

                <Pagination
                  disablePrev={!cursor}
                  disableNext={!claimsData?.pagination.hasNextItems}
                  onPrev={loadPrevPage}
                  onNext={loadNextPage}
                  isLoadingNext={isClaimsPending && !!cursor}
                />
              </div>
            )}
          </>
        ) : activeTab === "rewards" ? (
          <>
            {isChessPuzzleEnabled && (
              <div
                className="w-fit flex items-center gap-1 bg-slate-100 p-1
                rounded-xl mb-6 border border-slate-200"
              >
                <button
                  onClick={() => selectRewardType("quiz")}
                  className={`flex items-center justify-center gap-2 px-5 py-2
                    rounded-lg text-sm font-bold transition-all ${
                      rewardType === "quiz"
                        ? "bg-white text-(--primary) shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  <span>Quizzes</span>
                </button>
                <button
                  onClick={() => selectRewardType("puzzle")}
                  className={`flex items-center justify-center gap-2 px-5 py-2
                    rounded-lg text-sm font-bold transition-all ${
                      rewardType === "puzzle"
                        ? "bg-white text-(--primary) shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  <span>Chess Puzzles</span>
                </button>
              </div>
            )}

            {effectiveRewardType === "quiz" ? (
              isQuizRewardsPending ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
                  <p className="text-slate-500 text-sm">
                    Loading your rewards...
                  </p>
                </div>
              ) : isQuizRewardsError ? (
                <AlertCard type="error" message={quizRewardsError.message} />
              ) : quizRewardsData?.data.length === 0 ? (
                <div
                  className="text-center py-20 bg-slate-50 rounded-3xl border-2
                  border-dashed border-slate-200"
                >
                  <div
                    className="w-16 h-16 bg-slate-100 rounded-full flex
                    items-center justify-center mx-auto mb-4"
                  >
                    <Gift size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    No rewards yet
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Complete more quizzes to earn sats rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <UserQuizSatsRewardTable
                    rewards={quizRewardsData?.data ?? []}
                  />

                  <Pagination
                    disablePrev={!cursor}
                    disableNext={!quizRewardsData?.pagination.hasNextItems}
                    onPrev={loadPrevPage}
                    onNext={loadNextPage}
                    isLoadingNext={isQuizRewardsPending && !!cursor}
                  />
                </div>
              )
            ) : isPuzzleRewardsPending ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
                <p className="text-slate-500 text-sm">
                  Loading your rewards...
                </p>
              </div>
            ) : isPuzzleRewardsError ? (
              <AlertCard type="error" message={puzzleRewardsError.message} />
            ) : puzzleRewardsData?.data.length === 0 ? (
              <div
                className="text-center py-20 bg-slate-50 rounded-3xl border-2
                border-dashed border-slate-200"
              >
                <div
                  className="w-16 h-16 bg-slate-100 rounded-full flex
                  items-center justify-center mx-auto mb-4"
                >
                  <Gift size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No rewards yet
                </h3>
                <p className="text-slate-500 mt-1">
                  Solve more chess puzzles to earn sats rewards!
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <UserChessPuzzleSatsRewardTable
                  rewards={puzzleRewardsData?.data ?? []}
                />

                <Pagination
                  disablePrev={!cursor}
                  disableNext={!puzzleRewardsData?.pagination.hasNextItems}
                  onPrev={loadPrevPage}
                  onNext={loadNextPage}
                  isLoadingNext={isPuzzleRewardsPending && !!cursor}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {isAddressesPending ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
                <p className="text-slate-500 text-sm">Loading addresses...</p>
              </div>
            ) : isAddressesError ? (
              <AlertCard type="error" message={addressesError.message} />
            ) : addressesData?.data.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center text-center py-20
                 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 gap-2"
              >
                <div
                  className="w-16 h-16 bg-slate-100 rounded-full flex
                  items-center justify-center mx-auto mb-4"
                >
                  <MapPin size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  No payout addresses
                </h3>
                <p className="text-slate-500 mt-1">
                  Add a Lightning address to start receiving rewards.
                </p>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 px-8"
                >
                  Add Your blink Address
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className="flex items-start gap-3 p-3 bg-(--primary)/10
                  border border-(--primary)/20 rounded-md text-sm text-(--primary)"
                >
                  <Info size={18} className="shrink-0 mt-0.5" />
                  <p>
                    <strong>Note:</strong> Satoshis are sent to default and
                    verified addresses only. Please ensure your payout address
                    is verified and set as default to receive rewards.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addressesData?.data.map((address) => (
                    <UserSatsRewardAddressCard
                      key={address.id}
                      address={address}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddSatsRewardAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
