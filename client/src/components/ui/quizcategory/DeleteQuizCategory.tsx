import React, { useState } from "react";
import { AppDropdown } from "../shared/AppDropdown";
import { SCNButton } from "../shared/button";
import { Delete, MoreVertical } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import type { TQuizCategory } from "../../../types/quizCategory";
import { useMutation } from "@tanstack/react-query";
import { quizCategoryAPI } from "../../../api/quizCategory";
import { useNotificationStore } from "../../../stores/notification";
import { Loader2 } from "lucide-react";

interface DeleteQuizCategoryProps {
  quizCategory: TQuizCategory;
}

export const DeleteQuizCategory: React.FC<DeleteQuizCategoryProps> = (props) => {
  const quizCategory = props.quizCategory;
  const [closeDeleteCategoryModal, setCloseDeleteCategoryModal] = useState(false);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification
  );

  const { isPending, mutate } = useMutation({
    mutationFn: quizCategoryAPI.delete,
    onSuccess: async (response: any) => {
      showCardNotification({ type: "success", message: response.message });
      setCloseDeleteCategoryModal(() => true);
      setTimeout(() => {
        hideCardNotification();
        setCloseDeleteCategoryModal(() => false);
        // Reload page to refresh the category list
        window.location.reload();
      }, 2000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const handleDelete = () => {
    mutate({ quizID: quizCategory.id });
  };

  return (
    <div>
      <AppDropdown
        label={
          <SCNButton className="p-1 py-0 h-6">
            <MoreVertical className="w-5 h-5 text-gray-800" />
          </SCNButton>
        }
      >
        <Modal
          openModalElement={
            <div>
              <Button
                type="button"
                className="flex items-center justify-center gap-2 h-auto py-1
                   px-3 bg-transparent w-32"
              >
                <Delete className="w-4 h-4 text-gray-800" />
                <span className="text-[12px] text-gray-800">Delete</span>
              </Button>
            </div>
          }
          closed={closeDeleteCategoryModal}
        >
          <div
            className="w-[90vw] sm:w-[80vw] md:w-[500px] min-h-[200px] h-auto bg-gray-50
                rounded-md p-6 flex items-center justify-center"
          >
            <div className="w-full flex flex-col items-center justify-center gap-6">
              <div className="w-full text-center">
                <h2 className="text-gray-800 font-semibold text-xl mb-2">
                  Delete Quiz Category
                </h2>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete the category{" "}
                  <span className="font-semibold">"{quizCategory.name}"</span>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="w-full flex items-center justify-center gap-4">
                <Button
                  type="button"
                  className="w-full md:w-40 bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={() => setCloseDeleteCategoryModal(true)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="w-full md:w-40 bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </AppDropdown>
    </div>
  );
};
