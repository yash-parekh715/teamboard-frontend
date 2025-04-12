// src/components/UI/DeleteConfirmationModal.tsx
import React from "react";
import Form from "./Form";
import Button from "./Buttons";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  props?: React.HTMLProps<HTMLDivElement>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Form isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-6">
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{itemName}</strong>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default DeleteConfirmationModal;
