import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { satsRewardAPI } from "../../../api/satsReward";
import { useAuthStore } from "../../../stores/auth";
import { UserSatsRewardCard } from "../../ui/satsReward/UserSatsRewardCard";
import { UserSatsRewardAddressCard } from "../../ui/satsReward/UserSatsRewardAddressCard";
import { UserClaimCard } from "../../ui/satsReward/UserClaimCard";
import { AddSatsRewardAddressModal } from "../../ui/satsReward/AddSatsRewardAddressModal";
import { AlertCard } from "../../ui/shared/AlertCard";
import { Button } from "../../ui/shared/Btn";
import { Pagination } from "../../ui/shared/Pagination";
import { Loader2, Plus, Gift, MapPin, Trophy } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const UserSatsRewardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "claims" | "rewards" | "addresses"
  >("claims");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.auth.user);
  const cursor = searchParams.get("cursor") || "";

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
    data: rewardsData,
    isPending: isRewardsPending,
    isError: isRewardsError,
    error: rewardsError,
  } = useQuery({
    queryKey: ["userSatsRewards", user.id, cursor],
    queryFn: () =>
      satsRewardAPI.getAllByUser({ userID: user.id, limit: 10, cursor }),
    enabled: activeTab === "rewards",
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
    } else if (
      activeTab === "rewards" &&
      rewardsData?.pagination.hasNextItems
    ) {
      setSearchParams({ cursor: rewardsData.pagination.nextCursor });
    }
  };

  const loadPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
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

      {/* Tabs */}
      <div
        className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit
        mb-8 border border-slate-200"
      >
        <button
          onClick={() => {
            setActiveTab("claims");
            setSearchParams({});
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold
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
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold
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
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm 
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
            {isRewardsPending ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary) mb-3" />
                <p className="text-slate-500 text-sm">
                  Loading your rewards...
                </p>
              </div>
            ) : isRewardsError ? (
              <AlertCard type="error" message={rewardsError.message} />
            ) : rewardsData?.data.length === 0 ? (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewardsData?.data.map((reward) => (
                    <UserSatsRewardCard key={reward.id} reward={reward} />
                  ))}
                </div>

                <Pagination
                  disablePrev={!cursor}
                  disableNext={!rewardsData?.pagination.hasNextItems}
                  onPrev={loadPrevPage}
                  onNext={loadNextPage}
                  isLoadingNext={isRewardsPending && !!cursor}
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
                className="text-center py-20 bg-slate-50 rounded-3xl border-2
                border-dashed border-slate-200"
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
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addressesData?.data.map((address) => (
                  <UserSatsRewardAddressCard
                    key={address.id}
                    address={address}
                  />
                ))}
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
