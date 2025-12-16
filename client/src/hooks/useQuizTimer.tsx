import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { attemptDurationAPI } from "../api/attemptDuration";
import { useAuthStore } from "../stores/auth";
import { useQuizAttemptStore } from "../stores/quizAttempt";

export const useQuizTimer = (quizID: string | undefined) => {
  const [duration, setDuration] = useState(0);
  const auth = useAuthStore((state) => state.auth);
  const userID = auth.user.id;
  const quizAttemptData = useQuizAttemptStore((state) => state.data);

  // Check if quiz is completed
  const isCompleted = quizAttemptData?.progress?.status === "COMPLETED";

  // Ref to keep track of duration for setInterval closure
  const durationRef = useRef(duration);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Fetch initial duration
  const { data: initialData, isSuccess } = useQuery({
    queryKey: ["attempt-duration", quizID],
    queryFn: async () => {
      if (!quizID) return null;
      return await attemptDurationAPI.get({ quizID });
    },
    enabled: !!quizID,
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid resetting/conflicts
  });

  // Sync local state with fetched data
  useEffect(() => {
    if (isSuccess && initialData?.data) {
      setDuration(initialData.data.duration || 0);
    }
  }, [isSuccess, initialData]);

  // Update mutation
  const { mutate: updateDuration } = useMutation({
    mutationFn: async (currentDuration: number) => {
      if (!quizID || !userID) return;
      return await attemptDurationAPI.update({
        quizID,
        userID,
        duration: currentDuration,
      });
    },
    onError: (error) => {
      console.error("Failed to sync attempt duration:", error);
    },
  });

  // Timer interval (1s)
  useEffect(() => {
    if (!quizID || isCompleted) return;

    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quizID, isCompleted]);

  // Sync interval (10s)
  useEffect(() => {
    if (!quizID || !userID || isCompleted) return;

    const syncTimer = setInterval(() => {
      // Use ref to get latest duration inside closure
      updateDuration(durationRef.current);
    }, 10000);

    return () => clearInterval(syncTimer);
  }, [quizID, userID, updateDuration, isCompleted]);

  // Send final update when completed
  useEffect(() => {
    if (isCompleted && quizID && userID) {
      updateDuration(durationRef.current);
    }
  }, [isCompleted, quizID, userID, updateDuration]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    duration,
    formatDuration,
  };
};
