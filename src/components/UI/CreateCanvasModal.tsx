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
  ...props
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
    // <Form
    //   isOpen={isOpen}
    //   onClose={onClose}
    //   title="Create New Canvas"
    //   // overlayClass="backdrop-blur-sm bg-black/30"
    //   // modalClass="bg-white/90 backdrop-blur-xl border border-purple-100 rounded-2xl"
    // >
    //   <form onSubmit={handleSubmit} className="space-y-6">
    //     <div>
    //       <label className="block text-sm font-medium text-gray-600 mb-2">
    //         Canvas Name
    //       </label>
    //       <input
    //         type="text"
    //         className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
    //         placeholder="Enter canvas name"
    //       />
    //     </div>

    //     <div className="flex justify-end gap-3">
    //       <Button
    //         variant="secondary"
    //         className="bg-white/50 backdrop-blur-sm border border-purple-200 text-purple-600 hover:bg-purple-50"
    //       >
    //         Cancel
    //       </Button>
    //       <Button
    //         variant="primary"
    //         className="bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30"
    //       >
    //         Create Canvas
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
  );
};

export default CreateCanvasModal;
