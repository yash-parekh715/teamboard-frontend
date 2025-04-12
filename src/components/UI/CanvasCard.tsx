//src/components/UI/CanvasCard.tsx
import React from "react";
import { Canvas } from "../Interfaces/Canvas";
import Button from "./Buttons";
import { TrashIcon, CollaboratorsIcon } from "./Icons";
import { useNavigate } from "react-router-dom";

interface CanvasCardProps {
  canvas: Canvas;
  onDelete: (canvasId: string) => void;
  onShare: (canvas: Canvas) => void;
  currentUserId: string;
  props?: React.HTMLProps<HTMLDivElement>;
}

export const CanvasCard: React.FC<CanvasCardProps> = ({
  canvas,
  onDelete,
  onShare,
  currentUserId,
}) => {
  const isOwner = canvas.owner.toString() === currentUserId;
  const navigate = useNavigate();

  // Stop event propagation for button clicks
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/canvas/${canvas.canvasId}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{canvas.name}</h3>
      </div>

      <div className="flex items-center space-x-4">
        {isOwner && (
          <>
            <Button
              variant="outline"
              onClick={(e) => handleButtonClick(e, () => onShare(canvas))}
              className="flex items-center gap-2"
            >
              <CollaboratorsIcon className="w-5 h-5" />
              {canvas.collaborators.length} Collaborators
            </Button>
            <Button
              variant="outline"
              onClick={(e) =>
                handleButtonClick(e, () => onDelete(canvas.canvasId))
              }
              className="flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
