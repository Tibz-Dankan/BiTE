import React from "react";
import type { TQuiz } from "../../../types/quiz";

interface AdminQuestionListProps {
  quiz: TQuiz;
}

export const AdminQuestionList: React.FC<AdminQuestionListProps> = (props) => {
  console.log("props :", props);
  return <div>AdminQuestionList</div>;
};
