// src/pages/WhiteboardPage.tsx
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

const WhiteboardPage: React.FC = () => {
  const { canvasId } = useParams<{ canvasId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const elementsRef = useRef<DrawingElement[]>([]);
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
  const currentElementRef = useRef<DrawingElement | null>(null);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    currentElementRef.current = currentElement;
  }, [currentElement]);

  // Initialize canvas context and socket connection
  useEffect(() => {
    const initializeCanvas = async () => {
      try {
        const response = await canvasService.getCanvasById(canvasId!);
        console.log(response);
        if (response.status === 200) {
          console.log(response.data);
          const canvas = response.data as Canvas;
          setElements(canvas.data?.elements || []);
          redrawCanvas(canvas.data?.elements || []);
        }
      } catch (err) {
        setError("Failed to load canvas");
      }
    };

    const setupCanvasContext = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.lineCap = "round";
      context.lineJoin = "round";
      setCtx(context);
    };

    const setupSocket = () => {
      try {
        const socket = initSocket(canvasId!);

        socket.on("connect", () => {
          setIsConnected(true);
          socket.emit("join-canvas", { canvasId: canvasId! });
        });

        socket.on("disconnect", () => setIsConnected(false));

        socket.on("canvas-data", (data) => {
          setElements(data.elements || []);
          redrawCanvas(data.elements || []);
        });

        socket.on("draw-element", (element) => {
          setElements((prev) => {
            if (prev.some((el) => el.id === element.id)) return prev;
            return [...prev, element];
          });
          drawElement(element);
        });

        socket.on("update-element", ({ elementId, updates }) => {
          setElements((prev) =>
            prev.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
          );
          redrawCanvas();
        });

        socket.on("delete-element", ({ elementId }) => {
          setElements((prev) => prev.filter((el) => el.id !== elementId));
          redrawCanvas();
        });

        socket.on("user-joined", (user) => {
          setActiveUsers((prev) => [...prev, user]);
        });

        socket.on("user-left", (userId) => {
          setActiveUsers((prev) => prev.filter((u) => u.userId !== userId));
        });

        socket.on(
          "active-users" as any,
          (users: { userId: string; name: string }[]) => {
            setActiveUsers(users);
          }
        );

        socket.on("error", (error) => {
          setError(error.message);
        });

        return () => {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("canvas-data");
          socket.off("draw-element");
          socket.off("update-element");
          socket.off("delete-element");
          socket.off("user-joined");
          socket.off("user-left");
          socket.off("active-users" as any);
          socket.off("error");
        };
      } catch (error) {
        setError("Failed to initialize socket connection");
      }
    };

    initializeCanvas();
    setupCanvasContext();
    const socketCleanup = setupSocket();

    return () => {
      socketCleanup?.();
      disconnectSocket();
    };
  }, [canvasId]);

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
          ctx.font = `${element.bold ? "bold" : ""} ${
            element.italic ? "italic" : ""
          } ${element.fontSize}px ${element.font}`;
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

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent) => {
    if (!ctx || !canvasRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: tool === "pen" ? "path" : tool === "eraser" ? "eraser" : tool,
      points: [offsetX, offsetY],
      color: tool === "eraser" ? "#FFFFFF" : color,
      lineWidth: tool === "eraser" ? 20 : lineWidth,
    };

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const textElement: DrawingElement = {
          ...newElement,
          type: "text",
          text,
          points: [offsetX, offsetY],
        };
        setElements((prev) => [...prev, textElement]);
        getSocket()?.emit("draw-element", {
          canvasId: canvasId!,
          element: textElement,
        });
        saveCanvasState();
      }
      setIsDrawing(false);
      return;
    }

    setCurrentElement(newElement);
  };

  const continueDrawing = (e: React.MouseEvent) => {
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
    if (!isDrawing || !currentElementRef.current) return;

    setIsDrawing(false);
    const finalElement = currentElementRef.current;
    setElements((prev) => [...prev, finalElement]);
    getSocket()?.emit("draw-element", {
      canvasId: canvasId!,
      element: finalElement,
    });
    saveCanvasState();
    setCurrentElement(null);
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
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [canvasId]);

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
        getSocket()?.emit("clear-canvas", { canvasId: canvasId! });
        saveCanvasState();
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

            {/* <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
            /> */}
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
            <h3 className="font-medium mb-2">Active Users</h3>
            <ul className="space-y-1">
              {activeUsers.map((user) => (
                <li key={user.userId} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="truncate">{user.name}</span>
                </li>
              ))}
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
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
