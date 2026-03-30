import React from "react";
import {
  GraduationCap,
  ChevronRight,
  //  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { quizCategoryAPI } from "../../../api/quizCategory";
import { useAuthStore } from "../../../stores/auth";
import { Button } from "../shared/Btn";
import { useFeatureFlagEnabled } from "posthog-js/react";

export const MainUserCertificateClaimBanner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quizCategoryID = searchParams.get("qzCategoryID") ?? "";
  const userID = useAuthStore((state) => state.auth.user.id);
  const isCertificateEnabled = useFeatureFlagEnabled("certification");

  const { data: categoriesData } = useQuery({
    queryKey: ["user-quiz-categories-for-cert"],
    queryFn: () => quizCategoryAPI.getAll({ limit: 25, cursor: "" }),
    enabled: !!quizCategoryID && !!isCertificateEnabled,
  });

  const selectedCategory = categoriesData?.data?.find(
    (cat: any) => cat.id === quizCategoryID,
  );
  const certificateID = selectedCategory?.certificate?.id;

  const { data: claimData, isPending } = useQuery({
    queryKey: ["cert-claim-status", certificateID, userID],
    queryFn: () =>
      categoryCertificateAPI.getClaimStatus({
        id: certificateID!,
        userID: userID,
      }),
    enabled: !!certificateID && !!userID,
  });

  if (!isCertificateEnabled || !quizCategoryID || !certificateID || isPending) {
    return null;
  }

  if (!claimData?.data) return null;

  const { claimable, isClaimed } = claimData.data;

  const getBannerText = () => {
    if (isClaimed) {
      return "You have earned this certificate! View and download it.";
    }
    if (claimable) {
      return "You've completed all quizzes! Claim your certificate now.";
    }
    return "Complete all quizzes in this category to earn a certificate.";
  };

  const getButtonText = () => {
    if (isClaimed) return "View Certificate";
    if (claimable) return "Claim Certificate";
    return "View Progress";
  };

  return (
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
          {selectedCategory?.name} Certificate
        </p>
        <p className="text-xs text-gray-500 truncate">{getBannerText()}</p>
      </div>
      <Button
        type="button"
        className="flex-shrink-0 flex items-center gap-1 px-4 py-2 h-auto
         bg-(--primary) text-white text-sm rounded-lg hover:bg-(--primary)/90"
        onClick={() => navigate(`/u/quizzes/cert/${certificateID}`)}
      >
        {getButtonText()}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
