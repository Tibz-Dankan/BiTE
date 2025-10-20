export type QuizStatus = "upcoming" | "running" | "expired";

export const getQuizStatus = (startsAt: string, endsAt: string): QuizStatus => {
  const now = new Date();
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  if (now < startDate) {
    return "upcoming";
  }

  if (now >= startDate && now <= endDate) {
    return "running";
  }

  return "expired";
};
