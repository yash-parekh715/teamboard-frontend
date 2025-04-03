import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  initSocket,
  getSocket,
  disconnectSocket,
} from "../services/api/socketService";
import canvasService from "../services/api/canvasService";
import { Canvas, DrawingElement } from "../components/Interfaces/Canvas";
import ErrorAlert from "../components/ErrorAlert";
import Button from "../components/UI/Buttons";
import {
  ArrowLeftIcon,
  TrashIcon,
  CircleIcon,
  SquareIcon,
  TypeIcon,
  PenIcon,
  EraserIcon,
} from "../components/UI/Icons";

// Import the TextEditorModal component (needs to be created separately)
import TextEditorModal from "../components/UI/TextEditorModal";

const WhiteboardPage: React.FC = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<DrawingElement[]>([]);
  const currentElementRef = useRef<DrawingElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tool, setTool] = useState<
    "pen" | "rectangle" | "circle" | "text" | "path" | "eraser"
  >("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [activeUsers, setActiveUsers] = useState<
    { userId: string; name: string }[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null
  );

  // New state variables for text editing
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedTextElement, setSelectedTextElement] =
    useState<DrawingElement | null>(null);
  const [pendingTextPosition, setPendingTextPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Keep refs in sync with state
  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    currentElementRef.current = currentElement;
  }, [currentElement]);

  // Canvas drawing functions
  const redrawCanvas = useCallback(
    (elementsToDraw = elementsRef.current) => {
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      elementsToDraw.forEach(drawElement);
      if (currentElementRef.current) drawElement(currentElementRef.current);
    },
    [ctx]
  );

  const drawElement = useCallback(
    (element: DrawingElement) => {
      if (!ctx) return;

      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = element.lineWidth;

      switch (element.type) {
        case "text":
          // Enhanced text rendering with proper formatting
          const fontStyle = `${element.bold ? "bold " : ""}${
            element.italic ? "italic " : ""
          }${element.fontSize || 16}px ${element.fontFamily || "Arial"}`;
          ctx.font = fontStyle;
          ctx.fillStyle = element.color;
          ctx.fillText(
            element.text || "",
            element.points[0],
            element.points[1]
          );
          if (element.underline) {
            ctx.strokeStyle = element.color;
            ctx.beginPath();
            ctx.moveTo(element.points[0], element.points[1] + 2);
            ctx.lineTo(
              element.points[0] + ctx.measureText(element.text || "").width,
              element.points[1] + 2
            );
            ctx.stroke();
          }
          break;
        case "eraser":
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(
            element.points[0],
            element.points[1],
            element.lineWidth / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
          break;
        case "path":
          ctx.beginPath();
          ctx.moveTo(element.points[0], element.points[1]);
          for (let i = 2; i < element.points.length; i += 2) {
            ctx.lineTo(element.points[i], element.points[i + 1]);
          }
          ctx.stroke();
          break;
        case "rectangle":
          ctx.beginPath();
          ctx.rect(
            element.points[0],
            element.points[1],
            element.points[2] - element.points[0],
            element.points[3] - element.points[1]
          );
          ctx.stroke();
          break;
        case "circle":
          ctx.beginPath();
          const radius = Math.sqrt(
            Math.pow(element.points[2] - element.points[0], 2) +
              Math.pow(element.points[3] - element.points[1], 2)
          );
          ctx.arc(element.points[0], element.points[1], radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
      }
    },
    [ctx]
  );

  // Initialize canvas context and socket connection
  useEffect(() => {
    const setupCanvasContext = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.lineCap = "round";
      context.lineJoin = "round";
      setCtx(context);
    };

    setupCanvasContext();
  }, []);

  // Initialize socket and canvas data
  useEffect(() => {
    if (!canvasId) return;

    const initializeCanvas = async () => {
      try {
        const response = await canvasService.getCanvasById(canvasId);
        if (response.status === 200) {
          const canvas = response.data as Canvas;
          // Initialize with saved elements
          if (canvas.data?.elements) {
            setElements(canvas.data.elements);
          }
        }
      } catch (err) {
        setError("Failed to load canvas");
      }
    };

    const setupSocket = () => {
      try {
        // Ensure any existing socket is disconnected first
        disconnectSocket();

        const socket = initSocket(canvasId);

        socket.on("connect", () => {
          setIsConnected(true);
          // Request latest canvas data when connected
          socket.emit("join-canvas", { canvasId });
          // Request the current list of active users
          socket.emit("get-active-users", { canvasId });
        });

        socket.on("disconnect", () => {
          setIsConnected(false);
        });

        socket.on("canvas-data", (data) => {
          if (data && data.elements) {
            setElements(data.elements);
            redrawCanvas(data.elements);
          }
        });

        socket.on("draw-element", (element) => {
          // Add new element from other users and redraw
          setElements((prev) => {
            if (prev.some((el) => el.id === element.id)) return prev;
            const newElements = [...prev, element];
            // Schedule a redraw with the new elements
            setTimeout(() => redrawCanvas(newElements), 0);
            return newElements;
          });
        });

        socket.on("update-element", ({ elementId, updates }) => {
          setElements((prev) => {
            const updatedElements = prev.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            );
            // Schedule a redraw with the updated elements
            setTimeout(() => redrawCanvas(updatedElements), 0);
            return updatedElements;
          });
        });

        socket.on("delete-element", ({ elementId }) => {
          setElements((prev) => {
            const filteredElements = prev.filter((el) => el.id !== elementId);
            // Schedule a redraw with the filtered elements
            setTimeout(() => redrawCanvas(filteredElements), 0);
            return filteredElements;
          });
        });

        socket.on("user-joined", (user) => {
          setActiveUsers((prev) => {
            // Check if user already exists and remove them first to avoid duplicates
            const filteredUsers = prev.filter((u) => u.userId !== user.userId);
            return [...filteredUsers, user];
          });
        });

        socket.on("user-left", (userId) => {
          setActiveUsers((prev) => prev.filter((u) => u.userId !== userId));
        });

        socket.on("active-users", (users) => {
          // Use the correct event name without type casting
          setActiveUsers(users);
        });

        socket.on("error", (error) => {
          setError(error.message);
        });
        socket.on("clear-canvas", () => {
          setElements([]);
          if (ctx && canvasRef.current) {
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
        });

        return () => {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("canvas-data");
          socket.off("clear-canvas");
          socket.off("draw-element");
          socket.off("update-element");
          socket.off("delete-element");
          socket.off("user-joined");
          socket.off("user-left");
          socket.off("active-users");
          socket.off("error");
          disconnectSocket();
        };
      } catch (error) {
        setError("Failed to initialize socket connection");
        return () => {};
      }
    };

    // Load initial canvas data and then set up the socket
    initializeCanvas().then(setupSocket);

    // Clean up function for the effect
    return () => {
      disconnectSocket();
    };
  }, [canvasId, redrawCanvas]);

  // Redraw canvas when elements change
  useEffect(() => {
    redrawCanvas(elements);
  }, [elements, redrawCanvas]);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent) => {
    if (!ctx || !canvasRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;

    // Check if we're clicking on an existing text element
    if (!isDrawing) {
      const clickedElement = elements.find((element) => {
        if (element.type === "text") {
          // Simple hit testing for text elements
          const textWidth = ctx.measureText(element.text || "").width;
          const textHeight = element.fontSize || 16;
          return (
            offsetX >= element.points[0] &&
            offsetX <= element.points[0] + textWidth &&
            offsetY >= element.points[1] - textHeight &&
            offsetY <= element.points[1]
          );
        }
        return false;
      });

      if (clickedElement?.type === "text") {
        // If text element clicked, prepare for dragging
        setDraggingElementId(clickedElement.id);
        setDragOffset({
          x: offsetX - clickedElement.points[0],
          y: offsetY - clickedElement.points[1],
        });
        setIsDraggingText(true);
        return;
      }
    }

    // For text tool, open the text editor modal
    if (tool === "text") {
      setPendingTextPosition({ x: offsetX, y: offsetY });
      setShowTextEditor(true);
      return;
    }

    setIsDrawing(true);

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: tool === "pen" ? "path" : tool === "eraser" ? "eraser" : tool,
      points: [offsetX, offsetY],
      color: tool === "eraser" ? "#FFFFFF" : color,
      lineWidth: tool === "eraser" ? 20 : lineWidth,
    };

    setCurrentElement(newElement);
  };

  const continueDrawing = (e: React.MouseEvent) => {
    // Handle text element dragging
    if (isDraggingText && draggingElementId) {
      const { offsetX, offsetY } = e.nativeEvent;

      setElements((prev) =>
        prev.map((el) => {
          if (el.id === draggingElementId) {
            return {
              ...el,
              points: [
                offsetX - dragOffset.x,
                offsetY - dragOffset.y,
                ...el.points.slice(2), // Keep any other points if they exist
              ],
            };
          }
          return el;
        })
      );

      redrawCanvas();
      return;
    }

    if (!isDrawing || !currentElementRef.current || !ctx) return;

    const { offsetX, offsetY } = e.nativeEvent;
    let updatedElement: DrawingElement;

    if (currentElementRef.current.type === "path") {
      updatedElement = {
        ...currentElementRef.current,
        points: [...currentElementRef.current.points, offsetX, offsetY],
      };
    } else {
      updatedElement = {
        ...currentElementRef.current,
        points: [
          currentElementRef.current.points[0],
          currentElementRef.current.points[1],
          offsetX,
          offsetY,
        ],
      };
    }

    setCurrentElement(updatedElement);
    redrawCanvas();
  };

  const endDrawing = () => {
    // Handle text element dragging end
    if (isDraggingText && draggingElementId) {
      const updatedElement = elements.find((el) => el.id === draggingElementId);

      if (updatedElement) {
        // Emit the updated position to other users
        getSocket()?.emit("update-element", {
          canvasId: canvasId!,
          elementId: draggingElementId,
          updates: {
            points: updatedElement.points,
          },
        });

        // Save the canvas state
        saveCanvasState();
      }

      setIsDraggingText(false);
      setDraggingElementId(null);
      return;
    }

    if (!isDrawing || !currentElementRef.current) return;

    setIsDrawing(false);
    const finalElement = currentElementRef.current;

    // Add to local elements and emit to server
    setElements((prev) => [...prev, finalElement]);
    getSocket()?.emit("draw-element", {
      canvasId: canvasId!,
      element: finalElement,
    });
    saveCanvasState();
    setCurrentElement(null);
  };

  // Add double-click handler for editing text
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!ctx || !canvasRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;

    // Find if we're double-clicking on a text element
    const textElement = elements.find((element) => {
      if (element.type === "text") {
        const textWidth = ctx.measureText(element.text || "").width;
        const textHeight = element.fontSize || 16;
        return (
          offsetX >= element.points[0] &&
          offsetX <= element.points[0] + textWidth &&
          offsetY >= element.points[1] - textHeight &&
          offsetY <= element.points[1]
        );
      }
      return false;
    });

    if (textElement) {
      // Open text editor with the existing text data
      setSelectedTextElement(textElement);
      setShowTextEditor(true);
    }
  };

  // Handle saving text from the editor
  const handleSaveText = (textData: {
    text: string;
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  }) => {
    if (selectedTextElement) {
      // Update existing text element
      const updates = {
        text: textData.text,
        fontFamily: textData.fontFamily,
        fontSize: textData.fontSize,
        bold: textData.bold,
        italic: textData.italic,
        underline: textData.underline,
        color: textData.color,
      };

      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedTextElement.id ? { ...el, ...updates } : el
        )
      );

      // Emit update to other users
      getSocket()?.emit("update-element", {
        canvasId: canvasId!,
        elementId: selectedTextElement.id,
        updates,
      });

      setSelectedTextElement(null);
    } else if (pendingTextPosition) {
      // Create new text element
      const newTextElement: DrawingElement = {
        id: Date.now().toString(),
        type: "text",
        points: [pendingTextPosition.x, pendingTextPosition.y],
        text: textData.text,
        fontFamily: textData.fontFamily,
        fontSize: textData.fontSize,
        bold: textData.bold,
        italic: textData.italic,
        underline: textData.underline,
        color: textData.color,
        lineWidth: 1,
      };

      // Add to local elements and emit to server
      setElements((prev) => [...prev, newTextElement]);
      getSocket()?.emit("draw-element", {
        canvasId: canvasId!,
        element: newTextElement,
      });

      setPendingTextPosition(null);
    }

    saveCanvasState();
  };

  // Canvas saving with debounce
  const saveCanvasState = useCallback(() => {
    const debounceTimer = setTimeout(() => {
      try {
        getSocket()?.emit("save-canvas", {
          canvasId: canvasId!,
          data: { elements: elementsRef.current },
        });
      } catch (err) {
        setError("Failed to save canvas");
      }
    }, 1);

    return () => clearTimeout(debounceTimer);
  }, [canvasId]);

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);

        // First emit clear-canvas to notify other users
        getSocket()?.emit("clear-canvas", { canvasId: canvasId! });

        // Then immediately save the empty state to the server
        getSocket()?.emit("save-canvas", {
          canvasId: canvasId!,
          data: { elements: [] },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTool("pen")}
                className={`p-2 rounded-lg ${
                  tool === "pen" ? "bg-purple-100" : "bg-white"
                }`}
                title="Pen"
              >
                <PenIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool("rectangle")}
                className={`p-2 rounded-lg ${
                  tool === "rectangle" ? "bg-purple-100" : "bg-white"
                }`}
                title="Rectangle"
              >
                <SquareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool("circle")}
                className={`p-2 rounded-lg ${
                  tool === "circle" ? "bg-purple-100" : "bg-white"
                }`}
                title="Circle"
              >
                <CircleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool("text")}
                className={`p-2 rounded-lg ${
                  tool === "text" ? "bg-purple-100" : "bg-white"
                }`}
                title="Text"
              >
                <TypeIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setTool("eraser")}
                className={`p-2 rounded-lg ${
                  tool === "eraser" ? "bg-purple-100" : "bg-white"
                }`}
                title="Eraser"
              >
                <EraserIcon className="w-5 h-5" />
              </button>
            </div>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            />

            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="px-3 py-2 rounded border border-gray-300 bg-white"
            >
              <option value="2">Thin</option>
              <option value="5">Medium</option>
              <option value="10">Thick</option>
            </select>

            <Button variant="outline" onClick={clearCanvas}>
              <TrashIcon className="w-5 h-5 mr-2" />
              Clear
            </Button>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {error && <ErrorAlert error={error} onClose={() => setError(null)} />}

        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-lg shadow w-48">
            <h3 className="font-medium mb-2">
              Active Users ({activeUsers.length})
            </h3>
            <ul className="space-y-1">
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <li key={user.userId} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="truncate">{user.name}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">No active users</li>
              )}
            </ul>
          </div>

          <canvas
            ref={canvasRef}
            width={window.innerWidth - 300}
            height={window.innerHeight - 200}
            className="bg-white rounded-lg shadow-xl border border-gray-200"
            onMouseDown={startDrawing}
            onMouseMove={continueDrawing}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onDoubleClick={handleDoubleClick}
          />
        </div>
      </div>

      {/* Text Editor Modal */}
      {showTextEditor && (
        <TextEditorModal
          onClose={() => {
            setShowTextEditor(false);
            setSelectedTextElement(null);
            setPendingTextPosition(null);
          }}
          onSave={handleSaveText}
          initialText={selectedTextElement?.text || ""}
          initialStyle={{
            fontFamily: selectedTextElement?.fontFamily || "Arial",
            fontSize: selectedTextElement?.fontSize || 16,
            bold: selectedTextElement?.bold || false,
            italic: selectedTextElement?.italic || false,
            underline: selectedTextElement?.underline || false,
            color: selectedTextElement?.color || color,
          }}
        />
      )}
    </div>
  );
};

export default WhiteboardPage;
