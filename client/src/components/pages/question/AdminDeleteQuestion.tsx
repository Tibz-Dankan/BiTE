import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteQuestion } from "../../ui/question/DeleteQuestion";
import { useRouteStore } from "../../../stores/routes";
import { useQuery } from "@tanstack/react-query";
import { questionAPI } from "../../../api/question";
import { Loader2 } from "lucide-react";
import { truncateString } from "../../../utils/truncateString";

export const AdminDeleteQuestion: React.FC = () => {
  const { quizID, questionID } = useParams<{
    quizID: string;
    questionID: string;
  }>();
  const navigate = useNavigate();
  const updateCurrentPage = useRouteStore((state) => state.updateCurrentPage);

  const { data: questionData, isLoading } = useQuery({
    queryKey: ["question", questionID],
    queryFn: () => questionAPI.getByID({ id: questionID! }),
    enabled: !!questionID,
  });

  React.useEffect(() => {
    updateCurrentPage({
      title: "Delete Question",
      icon: undefined,
      path: "/a/quizzes/:quizID/questions/:questionID/delete",
      showInSidebar: false,
      element: undefined,
    });
  }, [updateCurrentPage]);

  if (!questionID || !quizID) return <div>Invalid IDs</div>;

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
        <DeleteQuestion
          questionID={questionID}
          questionTitle={
            questionData?.data?.title
              ? truncateString(questionData.data.title, 20)
              : undefined
          }
          onSuccess={() => {
            navigate(`/a/quizzes/${quizID}/questions`);
          }}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};
