import { Timer } from "lucide-react";
import { useQuizTimer } from "../../../hooks/useQuizTimer";

interface QuizTimerProps {
  quizID: string;
}

export function QuizTimer({ quizID }: QuizTimerProps) {
  const { duration, formatDuration } = useQuizTimer(quizID);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-(--primary)/10 rounded-fulls rounded-md border-[1.5px] border-(--primary)/20">
      <Timer className="w-4 h-4 text-(--primary)" />
      <span className="text-sm font-medium text-(--primary) min-w-[3rem] text-center">
        {formatDuration(duration)}
      </span>
    </div>
  );
}
