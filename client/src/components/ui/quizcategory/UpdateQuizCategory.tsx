import React, { useState } from "react";
import { Edit } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "@headlessui/react";
import { UpdateQuizCategoryForm } from "./UpdateQuizCategoryForm";
import type { TQuizCategory } from "../../../types/quizCategory";

interface UpdateQuizCategoryProps {
  quizCategory: TQuizCategory;
}

export const UpdateQuizCategory: React.FC<UpdateQuizCategoryProps> = (props) => {
  const quizCategory = props.quizCategory;
  const [closeUpdateCategoryModal, setCloseUpdateCategoryModal] = useState(false);

  const onUpdateCategorySuccess = (succeeded: boolean) => {
    setCloseUpdateCategoryModal(() => succeeded);
    setTimeout(() => {
      setCloseUpdateCategoryModal(() => false);
    }, 2000);
  };

  return (
    <div>
        <Modal
          openModalElement={
            <div>
              <Button
                type="button"
                className="flex items-center justify-center gap-2 h-auto
                 p-2 bg-transparent w-auto"
              >
                <Edit className="w-4 h-4 text-gray-800" />
              </Button>
            </div>
          }
          closed={closeUpdateCategoryModal}
        >
          <div
            className="w-[90vw] sm:w-[80vw] min-h-[50vh] h-auto max-h-[80vh] bg-gray-50
                rounded-md p-4 flex items-start justify-center overflow-x-hidden"
          >
            <div className="w-full">
              <UpdateQuizCategoryForm
                quizCategory={quizCategory}
                onSuccess={onUpdateCategorySuccess}
              />
            </div>
          </div>
        </Modal>
    </div>
  );
};
