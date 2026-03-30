import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { useAuthStore } from "../../../stores/auth";
import { SecondaryUserCertificateClaimBanner } from "../../ui/categorycertificate/SecondaryUserCertificateClaimBanner";
import { UserQuizCard } from "../../ui/quiz/UserQuizCard";
import { Loader2 } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import type { TQuiz } from "../../../types/quiz";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { PageNotFound } from "../common/PageNotFound";

export const UserCategoryCertificateQuizzes: React.FC = () => {
  const { certID } = useParams<{ certID: string }>();
  const userID = useAuthStore((state) => state.auth.user.id);
  const isCertificateEnabled = useFeatureFlagEnabled("certification");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["cert-claim-status-page", certID, userID],
    queryFn: () =>
      categoryCertificateAPI.getClaimStatus({
        id: certID!,
        userID: userID,
      }),
    enabled: !!certID && !!userID && !!isCertificateEnabled,
  });

  if (!isCertificateEnabled) {
    return <PageNotFound />;
  }

  if (isPending) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <AlertCard type={"error"} message={error ? error.message : ""} />
      </div>
    );
  }

  const claimStatusData = data?.data;
  const categoryName =
    claimStatusData?.certificate?.quizCategory?.name ?? "Category";
  const quizProgresses = claimStatusData?.quizProgresses ?? [];

  // Map quizProgresses to TQuiz-compatible objects for UserQuizCard
  const quizzes: TQuiz[] = quizProgresses.map((qp: any) => ({
    ...qp.quiz,
    questionCount: qp.totalQuestions,
    attemptCount: 0,
    quizCategory: claimStatusData?.certificate?.quizCategory
      ? {
          id: claimStatusData.certificate.quizCategory.id,
          name: claimStatusData.certificate.quizCategory.name,
          color: claimStatusData.certificate.quizCategory.color,
        }
      : undefined,
    userProgress: {
      status: qp.status,
      totalAttemptedQuestions: qp.totalAttemptedQuestions,
      totalQuestions: qp.totalQuestions,
    },
  }));

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl text-gray-800 font-bold text-foreground">
          {categoryName} Certificate
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Complete all quizzes below to earn your certificate
        </p>
      </div>

      {/* Banner */}
      <SecondaryUserCertificateClaimBanner />

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <UserQuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            No quizzes found
          </h3>
          <p className="text-slate-600">
            No quizzes are linked to this certificate yet.
          </p>
        </div>
      )}
    </div>
  );
};
