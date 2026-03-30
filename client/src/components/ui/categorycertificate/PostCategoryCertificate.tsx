import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import type { TQuizCategory } from "../../../types/quizCategory";
import { useMutation } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { useNotificationStore } from "../../../stores/notification";

interface PostCategoryCertificateProps {
  quizCategory: TQuizCategory;
  onSuccess: (succeeded: boolean) => void;
}

export const PostCategoryCertificate: React.FC<PostCategoryCertificateProps> = (
  props,
) => {
  const quizCategory = props.quizCategory;
  const [closeModal, setCloseModal] = useState(false);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification,
  );

  const { isPending, mutate } = useMutation({
    mutationFn: categoryCertificateAPI.post,
    onSuccess: async (response: any) => {
      showCardNotification({ type: "success", message: response.message });
      setCloseModal(() => true);
      props.onSuccess(true);
      setTimeout(() => {
        hideCardNotification();
        setCloseModal(() => false);
      }, 2000);
    },
    onError: (error: any) => {
      showCardNotification({ type: "error", message: error.message });
      setTimeout(() => {
        hideCardNotification();
      }, 7000);
    },
  });

  const handlePost = () => {
    mutate({ quizCategoryID: quizCategory.id });
  };

  return (
    <Modal
      openModalElement={
        <div>
          <Button
            type="button"
            className="flex items-center justify-center gap-2
             px-4 py-2 w-full bg-(--primary) text-white text-sm
             hover:bg-(--primary)/90 rounded-md"
          >
            Enable Certificate
          </Button>
        </div>
      }
      closed={closeModal}
    >
      <div
        className="w-[90vw] sm:w-[80vw] md:w-[500px] min-h-[200px] h-auto bg-gray-50
            rounded-md p-6 flex items-center justify-center"
      >
        <div className="w-full flex flex-col items-center justify-center gap-6">
          <div className="w-full text-center">
            <h2 className="text-gray-800 font-semibold text-xl mb-2">
              Enable Certificate
            </h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to enable a certificate for the category{" "}
              <span className="font-semibold">"{quizCategory.name}"</span>? The
              category must have at least 2 attemptable and visible quizzes.
            </p>
          </div>
          <div className="w-full flex items-center justify-center gap-4">
            <Button
              type="button"
              className="w-full md:w-40 bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={() => setCloseModal(true)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="w-full md:w-40 bg-(--primary) text-white hover:bg-(--primary)/90"
              onClick={handlePost}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enabling...
                </>
              ) : (
                "Enable"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
