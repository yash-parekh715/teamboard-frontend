//src/components/UI/CanvasCard.tsx
import React from "react";
import { Canvas } from "../Interfaces/Canvas";
import Button from "./Buttons";
import { TrashIcon, CollaboratorsIcon } from "./Icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  ...props
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
    // <motion.div
    //   whileHover={{ scale: 1.02 }}
    //   className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-purple-100 hover:border-purple-200 cursor-pointer"
    // >
    //   <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-500/5 rounded-2xl" />

    //   <div className="relative">
    //     <div className="flex justify-between items-start mb-4">
    //       <h3 className="text-xl font-bold text-gray-800">{canvas.name}</h3>
    //       {isOwner && (
    //         <span className="px-3 py-1 bg-purple-600/10 text-purple-600 text-sm rounded-full">
    //           Owner
    //         </span>
    //       )}
    //     </div>

    //     <div className="flex flex-wrap gap-3">
    //       <Button
    //         variant="outline"
    //         className="bg-white/50 backdrop-blur-sm border-purple-200 hover:border-purple-300 text-purple-600 hover:text-purple-700"
    //       >
    //         <CollaboratorsIcon className="w-5 h-5 text-purple-500" />
    //         {canvas.collaborators.length} Collaborators
    //       </Button>
    //       {isOwner && (
    //         <Button
    //           variant="outline"
    //           className="bg-white/50 backdrop-blur-sm border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
    //         >
    //           <TrashIcon className="w-5 h-5 text-red-500" />
    //           Delete
    //         </Button>
    //       )}
    //     </div>
    //   </div>
    // </motion.div>
  );
};
