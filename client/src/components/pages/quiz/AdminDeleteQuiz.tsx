import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteQuiz } from "../../ui/quiz/DeleteQuiz";
import { useRouteStore } from "../../../stores/routes";
import { useQuery } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import { Loader2 } from "lucide-react";

export const AdminDeleteQuiz: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", quizID],
    queryFn: () => quizAPI.getByID({ id: quizID! }),
    enabled: !!quizID,
  });

  // Ensure route store is updated (optional, but good for consistency/breadcrumbs)
  React.useEffect(() => {
    updateCurrentPage({
      title: "Delete Quiz",
      icon: undefined,
      path: "/a/quizzes/:quizID/delete",
      showInSidebar: false,
      element: undefined,
    });
  }, [updateCurrentPage]);

  if (!quizID) return <div>Invalid Quiz ID</div>;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <DeleteQuiz
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
