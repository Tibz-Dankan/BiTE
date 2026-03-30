import React from "react";
import { GraduationCap } from "lucide-react";
import type { TQuizCategory } from "../../../types/quizCategory";
import { PostCategoryCertificate } from "./PostCategoryCertificate";
import { DeleteCategoryCertificate } from "./DeleteCategoryCertificate";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";
import { useState } from "react";

interface AdminCategoryCertificateOpsProps {
  quizCategory: TQuizCategory;
}

export const AdminCategoryCertificateOps: React.FC<
  AdminCategoryCertificateOpsProps
> = (props) => {
  const quizCategory = props.quizCategory;
  const hasCertificate = quizCategory.certificate !== null;
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
              className="flex items-center justify-center gap-2 h-auto
               p-2 bg-transparent w-auto"
            >
              {hasCertificate ? (
                <GraduationCap className="w-5 h-5 text-gray-500 fill-gray-500" />
              ) : (
                <GraduationCap className="w-5 h-5 text-gray-800" />
              )}
            </Button>
          </div>
        }
        closed={closeModal}
      >
        <div
          className="w-[90vw] sm:w-[80vw] md:w-[400px] min-h-[150px] h-auto bg-gray-50
              rounded-md p-6 flex items-center justify-center"
        >
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full text-center">
              <h2 className="text-gray-800 font-semibold text-xl mb-2">
                Certificate
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {hasCertificate
                  ? `Certificate is enabled for "${quizCategory.name}".`
                  : `No certificate is set for "${quizCategory.name}".`}
              </p>
            </div>
            <div className="w-full flex items-center justify-center">
              {hasCertificate ? (
                <DeleteCategoryCertificate
                  quizCategory={quizCategory}
                  onSuccess={onSuccess}
                />
              ) : (
                <PostCategoryCertificate
                  quizCategory={quizCategory}
                  onSuccess={onSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
