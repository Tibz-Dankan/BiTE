import React from "react";
import { useMutation } from "@tanstack/react-query";
import { quizAPI } from "../../../api/quiz";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, Copy } from "lucide-react";

interface DuplicateQuizProps {
  quizID: string;
  quizTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DuplicateQuiz: React.FC<DuplicateQuizProps> = ({
  quizID,
  quizTitle,
  onSuccess,
  onCancel,
}) => {
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate: duplicateQuiz } = useMutation({
    mutationFn: quizAPI.duplicate,
    onSuccess: async (response) => {
      showCardNotification({ type: "success", message: response.message });
      setTimeout(() => {
        hideCardNotification();
      }, 5000);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const handleDuplicate = () => {
    duplicateQuiz({ quizID });
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 text-(--primary)">
        <Copy className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Duplicate Quiz</h3>
      </div>
      <p className="text-sm text-gray-600">
        Are you sure you want to make a copy of
        {quizTitle ? (
          <>
            {" "}
            <span className="font-bold">"{quizTitle}"</span>
          </>
        ) : (
          " this quiz"
        )}
        ?
      </p>
      <div className="p-3 bg-(--primary)/10 border border-(--primary)/20 rounded-md text-sm text-(--primary)">
        <strong>Note:</strong> All questions, answers, and attachments will be
        copied to the new quiz. The new quiz will be set to unattemptable by
        default.
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleDuplicate}
          disabled={isPending}
          className="bg-(--primary) hover:opacity-90 text-white border-none"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Duplicating...</span>
            </div>
          ) : (
            "Duplicate"
          )}
        </Button>
      </div>
    </div>
  );
};
