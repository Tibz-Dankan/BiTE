export type Attachment = {
  id: string;
  type: "USER" | "QUIZ" | "QUESTION" | "ANSWER";
  quizID: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
};
