export type TAttachment = {
  id: string;
  type:
    | "USER"
    | "QUIZ"
    | "QUESTION"
    | "ANSWER"
    | "CERTIFICATE_PDF"
    | "CERTIFICATE_PNG";
  userID?: string;
  quizID?: string;
  questionID?: string;
  answerID?: string;
  certificateAwardedID?: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
};
