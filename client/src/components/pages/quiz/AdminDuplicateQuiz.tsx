import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DuplicateQuiz } from "../../ui/quiz/DuplicateQuiz";
import { useRouteStore } from "../../../stores/routes";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import { ConfirmCardSkeleton } from "../../ui/shared/ConfirmCardSkeleton";

export const AdminDuplicateQuiz: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", quizID],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
    enabled: !!quizID,
  });

  React.useEffect(() => {
    updateCurrentPage({
      title: "Duplicate Quiz",
      icon: undefined,
      path: "/a/quizzes/:quizID/duplicate",
      showInSidebar: false,
      element: undefined,
    });
  }, [updateCurrentPage]);

  if (!quizID) return <div>Invalid Quiz ID</div>;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <ConfirmCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <DuplicateQuiz
          quizID={quizID}
          quizTitle={quizData?.data?.title}
          onSuccess={() => {
            navigate("/a/quizzes");
          }}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};
