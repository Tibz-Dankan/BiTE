export type TAttachment = {
  id: string;
  type: "USER" | "QUIZ" | "QUESTION" | "ANSWER";
  userID?: string;
  quizID?: string;
  questionID?: string;
  answerID?: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
};
