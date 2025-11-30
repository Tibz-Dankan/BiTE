import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "@headlessui/react";
import { PostQuizCategoryForm } from "./PostQuizCategoryForm";

export const AddQuizCategoryButton: React.FC = () => {
  const [closeModal, setCloseModal] = useState(false);

  const onSuccess = (succeeded: boolean) => {
    setCloseModal(() => succeeded);
    setTimeout(() => {
      setCloseModal(() => false);
    }, 2000);
  };

  return (
    <div>
      <Modal
        openModalElement={
          <div>
            <Button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full 
                font-semibold px-6 py-2 bg-(--primary)/10 border-1 border-gray-300 
                hover:bg-(--primary)/20"
            >
              <Plus className="w-5 h-5 text-(--primary)" />
              <span className="text-[14px] text-(--primary)">Quiz Category</span>
            </Button>
          </div>
        }
        closed={closeModal}
      >
        <div
          className="w-[90vw] sm:w-[80vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
                rounded-md p-4 flex items-start justify-center overflow-x-hidden"
        >
          <div className="w-full">
            <PostQuizCategoryForm onSuccess={onSuccess} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
