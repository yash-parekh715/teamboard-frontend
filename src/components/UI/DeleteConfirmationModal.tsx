// src/components/UI/DeleteConfirmationModal.tsx
import React from "react";
import Form from "./Form";
import Button from "./Buttons";
import { TrashIcon } from "./Icons";
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
  ...props
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
    // <Form
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   title="Confirm Deletion"
    //   // modalClass="bg-white/90 backdrop-blur-xl border border-purple-100 rounded-2xl"
    // >
    //   <div className="space-y-6">
    //     <p className="text-gray-600 leading-relaxed">
    //       Deleting <strong className="text-purple-600">{itemName}</strong> will
    //       permanently remove all associated data. This action cannot be undone.
    //     </p>

    //     <div className="flex justify-end gap-3">
    //       <Button variant="secondary">Cancel</Button>
    //       <Button
    //         variant="outline"
    //         className="bg-red-600/10 border-red-200 text-red-600 hover:bg-red-50"
    //       >
    //         <TrashIcon className="w-5 h-5 mr-2" />
    //         Confirm Delete
    //       </Button>
    //     </div>
    //   </div>
    // </Form>
  );
};

export default DeleteConfirmationModal;
