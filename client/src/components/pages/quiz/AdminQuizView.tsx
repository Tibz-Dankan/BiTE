import React from "react";
import { AdminQuizCategoryFilter } from "../../ui/quizcategory/AdminQuizCategoryFilter";
import { AdminQuizList } from "../../ui/quiz/AdminQuizList";

export const AdminQuizView: React.FC = () => {
  return (
    <div className="w-full mt-4 mb-16 space-y-12">
      <AdminQuizCategoryFilter />
      <AdminQuizList />
    </div>
  );
};
