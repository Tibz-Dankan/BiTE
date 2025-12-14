import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Trophy, ArrowRight } from "lucide-react";

interface QuizCompletionCardProps {
  quizID: string;
}

export const QuizCompletionCard: React.FC<QuizCompletionCardProps> = ({
  quizID,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Trophy className="w-10 h-10 text-orange-600" />
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Congratulations!
      </h2>
      <p className="text-slate-600 mb-8">
        You have successfully completed the quiz. Great effort!
      </p>

      <button
        onClick={() => navigate(`/u/quizzes/${quizID}/results`)}
        className="w-full py-4 bg-(--primary) text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-200"
      >
        View Results
        <ArrowRight size={20} />
      </button>
    </div>
  );
};
