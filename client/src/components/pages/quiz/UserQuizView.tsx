import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { quizAPI } from "../../../api/quiz";
import { quizCategoryAPI } from "../../../api/quizCategory";
import type { TQuiz } from "../../../types/quiz";
import type { TQuizCategory } from "../../../types/quizCategory";
import { Loader2, Search } from "lucide-react";
import { AlertCard } from "../../ui/shared/AlertCard";
import { UserQuizCard } from "../../ui/quiz/UserQuizCard";
import { UserQuizCategoryFilter } from "../../ui/quizcategory/UserCategoryFilter";

export const UserQuizView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizCategories, setQuizCategories] = useState<TQuizCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const cursor = searchParams.get("qzCursor")!;
  const hasCursor: boolean = !!cursor;
  const quizCategoryID = searchParams.get("qzCategoryID")!;
  const hasQuizCategoryID: boolean = !!quizCategoryID;

  // Fetch quizzes
  const {
    isPending: isPendingQuizzes,
    isError: isErrorQuizzes,
    data: quizzesData,
    error: quizzesError,
  } = useQuery({
    queryKey: [`user-quiz-view-${cursor}-${quizCategoryID}`],
    queryFn: () =>
      quizAPI.getAll({
        limit: 20,
        cursor: hasCursor ? cursor : "",
        quizCategoryID: hasQuizCategoryID ? quizCategoryID : "",
      }),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["user-quiz-categories"],
    queryFn: () => quizCategoryAPI.getAll({ limit: 25, cursor: "" }),
  });

  const quizzes: TQuiz[] = quizzesData?.data ?? [];

  useEffect(() => {
    if (categoriesData?.data) {
      setQuizCategories(categoriesData.data);
    }
  }, [categoriesData]);

  const onSelectCategoryHandler = (categoryId: string) => {
    setSelectedCategoryId(() => categoryId);
    setSearchParams(
      (prev) => {
        if (categoryId) {
          prev.set("qzCategoryID", categoryId);
        } else {
          prev.delete("qzCategoryID");
        }
        prev.delete("qzCursor"); // Reset cursor when changing category
        return prev;
      },
      { replace: false }
    );
  };

  // Filter quizzes by search term locally
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.introduction?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isPendingQuizzes) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-800" />
          <span className="text-gray-800 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (isErrorQuizzes) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center">
        <AlertCard
          type={"error"}
          message={quizzesError ? quizzesError.message : ""}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Hero Header */}
      <div
        className="text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(74.93% 0.154 70.67) 0%, oklch(65% 0.18 60) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Explore Knowledge
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Challenge yourself with curated quizzes across various subjects
              and elevate your learning journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search quizzes by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <UserQuizCategoryFilter
            categories={quizCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategoryHandler}
          />
        </div>

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
    </div>
  );
};
