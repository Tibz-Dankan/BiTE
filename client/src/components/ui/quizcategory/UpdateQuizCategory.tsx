import React, { useState } from "react";
import { AppDropdown } from "../shared/AppDropdown";
import { SCNButton } from "../shared/button";
import { Edit, MoreVertical } from "lucide-react";
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
      <AppDropdown
        label={
          <SCNButton className="p-1 py-0 h-6 bg-green-500s">
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
                <Edit className="w-4 h-4 text-gray-800" />
                <span className="text-[12px] text-gray-800">Edit Category</span>
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
      </AppDropdown>
    </div>
  );
};
