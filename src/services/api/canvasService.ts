// src/services/api/canvasService.ts
import apiClient from "./axios";
import { CanvasResponse } from "../../components/Interfaces/Canvas";

const canvasService = {
  createCanvas: async (name: string): Promise<CanvasResponse> => {
    return apiClient.post("/canvas", { name });
  },

  getCanvases: async (): Promise<CanvasResponse> => {
    return apiClient.get("/canvas");
  },

  getCanvasById: async (canvasId: string): Promise<CanvasResponse> => {
    return apiClient.get(`/canvas/${canvasId}`);
  },

  addCollaborator: async (
    canvasId: string,
    userId: string
  ): Promise<CanvasResponse> => {
    return apiClient.post(`/canvas/${canvasId}/collaborators`, {
      email: userId,
    });
  },

  deleteCanvas: async (canvasId: string): Promise<CanvasResponse> => {
    return apiClient.delete(`/canvas/${canvasId}`);
  },
};

export default canvasService;
