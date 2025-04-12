import { io, Socket } from "socket.io-client";
import { Canvas, DrawingElement } from "../../components/Interfaces/Canvas";

interface ServerToClientEvents {
  "canvas-data": (data: Canvas["data"]) => void;
  "draw-element": (element: DrawingElement) => void;
  "update-element": (data: {
    elementId: string;
    updates: Partial<DrawingElement>;
  }) => void;
  "delete-element": (data: { elementId: string }) => void;
  "user-joined": (user: { userId: string; name: string }) => void;
  "user-left": (userId: string) => void;
  "canvas-saved": (data: { success: boolean }) => void;
  "clear-canvas": () => void;
  "active-users": (users: { userId: string; name: string }[]) => void;
  error: (error: { message: string }) => void;
}

interface ClientToServerEvents {
  "join-canvas": (data: { canvasId: string }) => void;
  "get-active-users": (data: { canvasId: string }) => void;
  "draw-element": (data: { canvasId: string; element: DrawingElement }) => void;
  "update-element": (data: {
    canvasId: string;
    elementId: string;
    updates: Partial<DrawingElement>;
  }) => void;
  "delete-element": (data: { canvasId: string; elementId: string }) => void;
  "save-canvas": (data: { canvasId: string; data: Canvas["data"] }) => void;
  "clear-canvas": (data: { canvasId: string }) => void;
}
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export const initSocket = (canvasId: string): AppSocket => {
  if (socket && socket.connected) {
    return socket;
  }

  // Close existing socket if it exists but is not connected
  if (socket) {
    socket.close();
    socket = null;
  }

  socket = io(`${import.meta.env.VITE_WS_URL}`, {
    query: {
      canvasId,
      transport: "websocket",
    },
    withCredentials: true,
  });

  // Debug events
  socket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect" || reason === "transport close") {
      // Try to reconnect after 1 second
      setTimeout(() => {
        if (socket) {
          console.log("Attempting to reconnect...");
          socket.connect();
        }
      }, 1000);
    }
  });

  // Add debug event for all incoming socket events
  socket.onAny((event, ...args) => {
    console.log("Received socket event:", event, args);
  });

  // Try to connect immediately
  socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("Manually disconnecting socket");
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): AppSocket | null => {
  return socket;
};
