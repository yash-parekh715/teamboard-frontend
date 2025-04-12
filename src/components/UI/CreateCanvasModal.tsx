// src/components/UI/CreateCanvasModal.tsx
import React, { useState } from "react";
import Form from "./Form";
import Button from "./Buttons";

interface CreateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (canvasName: string) => void;
  props?: React.HTMLProps<HTMLDivElement>;
}

const CreateCanvasModal: React.FC<CreateCanvasModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [canvasName, setCanvasName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canvasName.trim()) {
      onCreate(canvasName.trim());
      setCanvasName("");
      onClose();
    }
  };

  return (
    <Form isOpen={isOpen} onClose={onClose} title="Create New Canvas">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canvas Name
          </label>
          <input
            type="text"
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Enter canvas name"
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Canvas
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCanvasModal;
