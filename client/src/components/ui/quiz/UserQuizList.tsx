import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { quizAPI } from "../../../api/quiz";
import { useSearchParams } from "react-router-dom";
import type { TQuiz } from "../../../types/quiz";
import { UserQuizCard } from "./UserQuizCard";
import { AlertCard } from "../shared/AlertCard";
import { Loader2 } from "lucide-react";

export const UserQuizList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(""); // to be used in search params

  const cursor = searchParams.get("qzCursor")!;
  const hasCursor: boolean = !!cursor;
  const quizCategoryID = searchParams.get("qzCategoryID")!;
  const hasQuizCategoryID: boolean = !!quizCategoryID;

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`user-quiz-list-${cursor}-${quizCategoryID}`],
    queryFn: () =>
      quizAPI.getAll({
        limit: 20,
        cursor: hasCursor ? cursor : "",
        quizCategoryID: hasQuizCategoryID ? quizCategoryID : "",
      }),
  });

  const quizzes: TQuiz[] = data?.data ?? [];

  // Filter quizzes by search term locally
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.introduction?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  return (
    <div className="w-full">
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <UserQuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            No quizzes found
          </h3>
          <p className="text-slate-600">
            Try adjusting your filters or search term
          </p>
        </div>
      )}
    </div>
  );
};
