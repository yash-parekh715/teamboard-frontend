// src/components/UI/AddCollaboratorModal.tsx
import React, { useState } from "react";
import Form from "./Form";
import Button from "./Buttons";
import { Canvas } from "../Interfaces/Canvas";
import { PlusIcon } from "./Icons";

interface AddCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvas: Canvas;
  onAdd: (userId: string) => void;
  props?: React.HTMLProps<HTMLDivElement>;
}

const AddCollaboratorModal: React.FC<AddCollaboratorModalProps> = ({
  isOpen,
  onClose,
  canvas,
  onAdd,
  ...props
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(email);
    setEmail("");
    onClose();
  };

  return (
    <Form isOpen={isOpen} onClose={onClose} title={`Share ${canvas.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collaborator Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter collaborator's email"
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Collaborator
          </Button>
        </div>
      </form>
    </Form>
    // <Form
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   title={`Share ${canvas.name}`}
    //   // modalClass="bg-white/90 backdrop-blur-xl border border-purple-100 rounded-2xl"
    // >
    //   <form onSubmit={handleSubmit} className="space-y-6">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-600 mb-2">
    //         Collaborator Email
    //       </label>
    //       <input
    //         type="email"
    //         className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
    //         placeholder="name@example.com"
    //       />
    //     </div>

    //     <div className="flex justify-end gap-3">
    //       <Button variant="secondary">Cancel</Button>
    //       <Button variant="primary">
    //         <PlusIcon className="w-5 h-5 mr-2" />
    //         Add Collaborator
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
  );
};

export default AddCollaboratorModal;
