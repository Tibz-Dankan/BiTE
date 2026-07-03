import React from "react";
import { Eye } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Btn";

interface ViewSolutionModalProps {
  isOpen: boolean;
  puzzleId: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ViewSolutionModal: React.FC<ViewSolutionModalProps> = ({
  isOpen,
  puzzleId,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-(--card) p-6 rounded-md min-w-[320px] max-w-[440px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-(--secondary) rounded-xl">
            <Eye className="text-(--primary)" size={22} />
          </div>
          <h2 className="text-lg font-bold text-(--foreground)">
            View solution?
          </h2>
        </div>

        <p className="text-sm text-(--muted-foreground) mb-6">
          Once you view the solution for this puzzle (
          <span className="font-medium text-(--foreground)">#{puzzleId}</span>),
          you won't be rewarded for it.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="px-6 bg-transparent border border-(--border) text-(--foreground) hover:bg-(--accent)"
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} className="px-6">
            View solution
          </Button>
        </div>
      </div>
    </Modal>
  );
};
