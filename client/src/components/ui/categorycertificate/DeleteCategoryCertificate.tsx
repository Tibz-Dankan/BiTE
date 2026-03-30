import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import type { TQuizCategory } from "../../../types/quizCategory";
import { useMutation } from "@tanstack/react-query";
import { categoryCertificateAPI } from "../../../api/categoryCertificate";
import { useNotificationStore } from "../../../stores/notification";

interface DeleteCategoryCertificateProps {
  quizCategory: TQuizCategory;
  onSuccess: (succeeded: boolean) => void;
}

export const DeleteCategoryCertificate: React.FC<
  DeleteCategoryCertificateProps
> = (props) => {
  const quizCategory = props.quizCategory;
  const [closeModal, setCloseModal] = useState(false);

  const showCardNotification = useNotificationStore(
    (state) => state.showCardNotification,
  );
  const hideCardNotification = useNotificationStore(
    (state) => state.hideCardNotification,
  );

  const { isPending, mutate } = useMutation({
    mutationFn: categoryCertificateAPI.delete,
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

  const handleDelete = () => {
    if (!quizCategory.certificate) return;
    mutate({ id: quizCategory.certificate.id });
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
            Disable Certificate
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
              Disable Certificate
            </h2>
            <p className="text-gray-600 text-sm">
              Are you sure you want to disable the certificate for the category{" "}
              <span className="font-semibold">"{quizCategory.name}"</span>? This
              action cannot be undone if the certificate has been awarded to
              users.
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
              className="w-full md:w-40 bg-red-500 text-white hover:bg-red-600"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
