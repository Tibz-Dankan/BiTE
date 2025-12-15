import React from "react";
import { useMutation } from "@tanstack/react-query";
import { questionAPI } from "../../../api/question";
import { useNotificationStore } from "../../../stores/notification";
import { Button } from "../shared/Btn";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteQuestionProps {
  questionID: string;
  questionTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DeleteQuestion: React.FC<DeleteQuestionProps> = ({
  questionID,
  questionTitle,
  onSuccess,
  onCancel,
}) => {
  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate: deleteQuestion } = useMutation({
    mutationFn: questionAPI.delete,
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

  const handleDelete = () => {
    deleteQuestion({ id: questionID });
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 text-red-500">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Delete Question</h3>
      </div>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete
        {questionTitle ? (
          <>
            {" "}
            <span className="font-bold">"{questionTitle}"</span>?
          </>
        ) : (
          " this question?"
        )}
      </p>
      <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
        <strong>Caution:</strong> This action cannot be undone. All associated
        answers will also be permanently deleted.
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
          onClick={handleDelete}
          disabled={isPending}
          className="bg-red-500 hover:bg-red-600 text-white border-none"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Deleting...</span>
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  );
};
