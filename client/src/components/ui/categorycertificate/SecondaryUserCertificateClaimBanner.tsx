import React, { useState } from "react";
import { GraduationCap, Download, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { useAuthStore } from "../../../stores/auth";
import { Button } from "../shared/Btn";
import { useNotificationStore } from "../../../stores/notification";
import { UserCategoryCertificateDownloadV2 } from "./UserCategoryCertificateDownloadV2";
import { useFeatureFlagEnabled } from "posthog-js/react";

export const SecondaryUserCertificateClaimBanner: React.FC = () => {
  const { certID } = useParams<{ certID: string }>();
  const userID = useAuthStore((state) => state.auth.user.id);
  const isCertificateEnabled = useFeatureFlagEnabled("certification");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification,
  );

  const {
    data: claimData,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["cert-claim-status-secondary", certID, userID],
    queryFn: () =>
      categoryCertificateAPI.getClaimStatus({
        id: certID!,
        userID: userID,
      }),
    enabled: !!certID && !!userID && !!isCertificateEnabled,
  });

  const { isPending: isClaimPending, mutate: claimMutate } = useMutation({
    mutationFn: categoryCertificateAPI.claim,
    onSuccess: async (response: any) => {
      showCardNotification({ type: "success", message: response.message });
      refetch();
      setTimeout(() => {
        hideCardNotification();
      }, 3000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  if (!isCertificateEnabled || !certID || isPending) {
    return null;
  }

  if (!claimData?.data) return null;

  const { claimable, isClaimed, certificate } = claimData.data;
  const categoryName = certificate?.quizCategory?.name ?? "Category";

  const getBannerText = () => {
    if (isClaimed) {
      return "Congratulations! You have earned this certificate. Download it below.";
    }
    if (claimable) {
      return "You've completed all required quizzes! Claim your certificate now.";
    }
    return "Complete all the quizzes below to unlock your certificate.";
  };

  const handleClaimClick = () => {
    if (!certID) return;
    claimMutate({
      userID: userID,
      categoryCertificateID: certID,
    });
  };

  return (
    <>
      <div
        className="w-full flex items-center gap-4 p-4 rounded-xl border
         border-gray-200 bg-gradient-to-r from-gray-50 to-white"
      >
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isClaimed || claimable ? "bg-yellow-100" : "bg-gray-100"
            }`}
          >
            <GraduationCap
              className={`w-5 h-5 ${
                isClaimed || claimable
                  ? "text-yellow-600 fill-yellow-600"
                  : "text-gray-500"
              }`}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">
            {categoryName} Certificate
          </p>
          <p className="text-xs text-gray-500">{getBannerText()}</p>
        </div>
        <div className="flex-shrink-0">
          {isClaimed ? (
            <Button
              type="button"
              className="flex items-center gap-1 px-4 py-2 h-auto
               bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
              onClick={() => setShowDownloadModal(true)}
            >
              <Download className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className={`flex items-center gap-1 px-4 py-2 h-auto text-sm rounded-lg ${
                claimable
                  ? "bg-(--primary) text-white hover:bg-(--primary)/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleClaimClick}
              disabled={!claimable || isClaimPending}
            >
              {isClaimPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim Certificate"
              )}
            </Button>
          )}
        </div>
      </div>

      {showDownloadModal && certID && (
        <UserCategoryCertificateDownloadV2
          certID={certID}
          userID={userID}
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </>
  );
};
