import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/UI/Buttons";
import {
  PlusIcon,
  ArrowLeftIcon,
  SearchIcon,
  TrashIcon,
  CollaboratorsIcon,
} from "../components/UI/Icons";
import canvasService from "../services/api/canvasService";
import ErrorAlert from "../components/ErrorAlert";
import { Canvas } from "../components/Interfaces/Canvas";
import CreateCanvasModal from "../components/UI/CreateCanvasModal";
import AddCollaboratorModal from "../components/UI/AddCollaboratorModal";
import DeleteConfirmationModal from "../components/UI/DeleteConfirmationModal";
import Logo from "../components/UI/Logo";
import { useUser } from "../contexts/UserContext";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [filteredCanvases, setFilteredCanvases] = useState<Canvas[]>([]);
  const [deleteCanvas, setDeleteCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "owned" | "shared">(
    "all"
  );
  const currentUserId = user?._id || "";

  useEffect(() => {
    const loadCanvases = async () => {
      try {
        const response = await canvasService.getCanvases();
        setCanvases(response.data as Canvas[]);
        setFilteredCanvases(response.data as Canvas[]);
      } catch (err) {
        setError("Failed to load canvases");
      } finally {
        setLoading(false);
      }
    };

    loadCanvases();
  }, []);

  useEffect(() => {
    // Filter canvases based on search term and filter mode
    let result = canvases;

    if (searchTerm) {
      result = result.filter((canvas) =>
        canvas.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMode === "owned") {
      result = result.filter(
        (canvas) => canvas.owner.toString() === currentUserId
      );
    } else if (filterMode === "shared") {
      result = result.filter(
        (canvas) =>
          canvas.owner.toString() !== currentUserId &&
          canvas.collaborators.includes(currentUserId)
      );
    }

    setFilteredCanvases(result);
  }, [canvases, searchTerm, filterMode, currentUserId]);

  const handleCreateCanvas = async (name: string) => {
    try {
      const response = await canvasService.createCanvas(name);
      setCanvases([...canvases, response.data as Canvas]);
      setShowCreateModal(false);
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
      setCanvases(
        canvases.map((c) =>
          c.canvasId === selectedCanvas.canvasId ? (response.data as Canvas) : c
        )
      );
    } catch (err) {
      setError("Failed to add collaborator");
    }
  };

  const handleDeleteCanvas = async (canvasId: string) => {
    try {
      const response = await canvasService.deleteCanvas(canvasId);
      if (response.status === 200) {
        setCanvases(canvases.filter((c) => c.canvasId !== canvasId));
      }
    } catch (err) {
      setError("Failed to delete canvas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pale-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-200/30 bg-[size:20px_20px] -z-10" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-purple-600/10 to-purple-500/5 -z-10" />
      <div className="absolute top-40 -left-32 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-40 -right-32 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30 -z-10" />

      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600"
                onClick={() => navigate("/")}
                aria-label="Back to home"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </motion.button>
              <Logo />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative md:w-80"
                >
                  <input
                    type="text"
                    placeholder="Search canvases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-purple-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name?.split(" ")[0] || "Creator"}
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Create, manage, and collaborate on interactive whiteboards. Your
            digital canvas awaits.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Canvases
              </h2>
              {!loading && (
                <span className="bg-purple-100 text-purple-600 text-sm font-medium px-3 py-1 rounded-full">
                  {filteredCanvases.length}
                  {filteredCanvases.length === 1 ? " canvas" : " canvases"}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex p-1 bg-purple-50 rounded-lg border border-purple-100">
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filterMode === "all"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-gray-600 hover:bg-white/50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode("owned")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filterMode === "owned"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-gray-600 hover:bg-white/50"
                  }`}
                >
                  Owned
                </button>
                <button
                  onClick={() => setFilterMode("shared")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filterMode === "shared"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-gray-600 hover:bg-white/50"
                  }`}
                >
                  Shared
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 rounded-full bg-purple-600 text-white p-3 shadow-lg hover:shadow-purple-500/30 transition-all"
                aria-label="Create new canvas"
              >
                <PlusIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ErrorAlert error={error} onClose={() => setError(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-purple-50/50 animate-pulse"
                >
                  <div className="h-6 bg-purple-100/50 rounded-lg w-3/4 mb-4"></div>
                  <div className="h-4 bg-purple-50/50 rounded-lg w-1/2 mb-6"></div>
                  <div className="flex justify-between mt-6">
                    <div className="h-8 bg-purple-50/30 rounded-lg w-1/3"></div>
                    <div className="h-8 bg-purple-50/30 rounded-lg w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCanvases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-6 rounded-full bg-purple-50 mb-5">
                <CollaboratorsIcon className="w-12 h-12 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No canvases found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchTerm
                  ? "No canvases match your search. Try a different term."
                  : filterMode !== "all"
                  ? `You don't have any ${
                      filterMode === "owned" ? "owned" : "shared"
                    } canvases.`
                  : "Create your first canvas to start collaborating!"}
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 rounded-md p-1"
              >
                <PlusIcon className="w-5 h-5 text-white" />
                <span className="pr-1 text-white">Create New Canvas</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCanvases.map((canvas, index) => (
                <motion.div
                  key={canvas.canvasId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="transform-gpu"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-purple-50 h-full">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {canvas.name}
                        </h3>
                        {canvas.owner.toString() === currentUserId && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                            Owner
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-2">
                        Last modified:{" "}
                        {new Date(canvas.lastModified).toLocaleDateString()}
                      </div>

                      <div className="flex items-center space-x-1 mb-4">
                        <div className="flex -space-x-2">
                          {[
                            ...Array(
                              Math.min(3, canvas.collaborators.length + 1)
                            ),
                          ].map((_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs border-2 border-white"
                            >
                              {i === 0
                                ? canvas.owner
                                    .toString()
                                    .substring(0, 1)
                                    .toUpperCase()
                                : i}
                            </div>
                          ))}
                        </div>
                        {canvas.collaborators.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{canvas.collaborators.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/canvas/${canvas.canvasId}`)}
                          className="text-purple-600 hover:bg-purple-50"
                        >
                          Open Canvas
                        </Button>

                        <div className="flex space-x-2">
                          {canvas.owner.toString() === currentUserId && (
                            <>
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCanvas(canvas);
                                }}
                                className="!p-2 text-purple-600 border-purple-200"
                              >
                                <CollaboratorsIcon className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteCanvas(canvas);
                                }}
                                className="!p-2 text-red-500 border-red-200"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Create New Canvas - Floating Button for Mobile */}
        <div className="sm:hidden fixed bottom-6 right-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white rounded-full p-4 shadow-lg"
          >
            <PlusIcon className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Modals */}
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
              setDeleteCanvas(null);
            }}
            itemName={deleteCanvas.name}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
