// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { CanvasCard } from "../components/UI/CanvasCard";
import Button from "../components/UI/Buttons";
import { PlusIcon } from "../components/UI/Icons";
import canvasService from "../services/api/canvasService";
import ErrorAlert from "../components/ErrorAlert";
import { Canvas } from "../components/Interfaces/Canvas";
import CreateCanvasModal from "../components/UI/CreateCanvasModal";
import AddCollaboratorModal from "../components/UI/AddCollaboratorModal";
import DeleteConfirmationModal from "../components/UI/DeleteConfirmationModal";
import authService from "../services/api/authService";
// import { motion, AnimatePresence } from "framer-motion";

const Dashboard: React.FC = () => {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [deleteCanvas, setDeleteCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentUserId = authService.getCurrentUser()?._id || null;
  // const navigate = useNavigate();

  useEffect(() => {
    const loadCanvases = async () => {
      try {
        const response = await canvasService.getCanvases();
        console.log("success");
        setCanvases(response.data as Canvas[]);
      } catch (err) {
        setError("Failed to load canvases");
      } finally {
        setLoading(false);
      }
    };

    loadCanvases();
  }, []);

  const handleCreateCanvas = async (name: string) => {
    try {
      const response = await canvasService.createCanvas(name);
      // if (response.success) {
      setCanvases([...canvases, response.data as Canvas]);
      setShowCreateModal(false);
      // }
    } catch (err) {
      setError("Failed to create canvas");
    }
  };

  const handleAddCollaborator = async (userId: string) => {
    if (!selectedCanvas) return;
    try {
      const response = await canvasService.addCollaborator(
        selectedCanvas.canvasId,
        userId
      );
      // if (response.success) {
      setCanvases(
        canvases.map((c) =>
          c.canvasId === selectedCanvas.canvasId ? (response.data as Canvas) : c
        )
      );
      // }
    } catch (err) {
      setError("Failed to add collaborator");
    }
  };

  const handleDeleteCanvas = async (canvasId: string) => {
    try {
      const response = await canvasService.deleteCanvas(canvasId);
      // if (response.success) {
      setCanvases(canvases.filter((c) => c.canvasId !== canvasId));
      // }
    } catch (err) {
      setError("Failed to delete canvas");
    }
  };
  return (
    <div className="min-h-screen bg-pale-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Canvases</h1>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            New Canvas
          </Button>
        </div>

        {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canvases.map((canvas) => (
              <CanvasCard
                key={canvas.canvasId}
                canvas={canvas}
                onDelete={(canvasId) =>
                  setDeleteCanvas(
                    canvases.find((c) => c.canvasId === canvasId) || null
                  )
                }
                onShare={(canvas) => setSelectedCanvas(canvas)}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateCanvasModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCanvas}
          />
        )}

        {selectedCanvas && (
          <AddCollaboratorModal
            isOpen={!!selectedCanvas}
            onClose={() => setSelectedCanvas(null)}
            canvas={selectedCanvas}
            onAdd={handleAddCollaborator}
          />
        )}
        {deleteCanvas && (
          <DeleteConfirmationModal
            isOpen={!!deleteCanvas}
            onClose={() => {
              setDeleteCanvas(null);
            }}
            onConfirm={() => {
              handleDeleteCanvas(deleteCanvas.canvasId);
              setSelectedCanvas(null);
            }}
            itemName={deleteCanvas.name}
          />
        )}
      </div>
    </div>
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   className="min-h-screen bg-pale-50 p-6 sm:p-8"
    // >
    //   <div className="max-w-7xl mx-auto">
    //     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    //       <motion.h1
    //         initial={{ y: -20 }}
    //         animate={{ y: 0 }}
    //         className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
    //       >
    //         Your Canvases
    //       </motion.h1>

    //       <motion.div
    //         whileHover={{ scale: 1.05 }}
    //         whileTap={{ scale: 0.95 }}
    //         className="relative group"
    //       >
    //         <Button
    //           variant="primary"
    //           onClick={() => setShowCreateModal(true)}
    //           className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:shadow-2xl transition-all pr-6 pl-5 py-3 rounded-xl"
    //         >
    //           <PlusIcon className="w-6 h-6 text-white animate-bounce-slow" />
    //           <span className="text-lg font-semibold">New Canvas</span>
    //         </Button>
    //       </motion.div>
    //     </div>

    //     <AnimatePresence>
    //       {error && (
    //         <ErrorAlert
    //           error={error}
    //           onClose={() => setError(null)}
    //           className="border-l-4 border-purple-600 bg-purple-50/90 backdrop-blur-sm"
    //         />
    //       )}
    //     </AnimatePresence>

    //     {loading ? (
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //         {[...Array(3)].map((_, i) => (
    //           <motion.div
    //             key={i}
    //             className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-100 animate-pulse"
    //           >
    //             <div className="h-7 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl w-3/4 mb-4" />
    //             <div className="h-4 bg-purple-50 rounded-xl w-1/2" />
    //           </motion.div>
    //         ))}
    //       </div>
    //     ) : (
    //       <motion.div
    //         layout
    //         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    //       >
    //         {canvases.map((canvas, index) => (
    //           <motion.div
    //             key={canvas.canvasId}
    //             initial={{ opacity: 0, y: 20 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             transition={{ delay: index * 0.05 }}
    //           >
    //             <CanvasCard
    //               key={canvas.canvasId}
    //               canvas={canvas}
    //               onDelete={(canvasId) =>
    //                 setDeleteCanvas(
    //                   canvases.find((c) => c.canvasId === canvasId) || null
    //                 )
    //               }
    //               onShare={(canvas) => setSelectedCanvas(canvas)}
    //               currentUserId={currentUserId}
    //             />
    //           </motion.div>
    //         ))}
    //       </motion.div>
    //     )}

    //     <AnimatePresence>
    //       {showCreateModal && (
    //         <CreateCanvasModal
    //           isOpen={showCreateModal}
    //           onClose={() => setShowCreateModal(false)}
    //           onCreate={handleCreateCanvas}
    //         />
    //       )}
    //     </AnimatePresence>
    //   </div>
    // </motion.div>
  );
};

export default Dashboard;
