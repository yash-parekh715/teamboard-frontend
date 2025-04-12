// src/components/UI/AddCollaboratorModal.tsx
import React, { useState } from "react";
import Form from "./Form";
import Button from "./Buttons";
import { Canvas } from "../Interfaces/Canvas";

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
  );
};

export default AddCollaboratorModal;
