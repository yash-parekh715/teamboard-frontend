// src/components/Interfaces/Canvas.ts
// src/components/Interfaces/Canvas.ts
export interface Canvas {
  canvasId: string;
  name: string;
  owner: string;
  collaborators: string[];
  data: CanvasData;
  isPublic: boolean;
  createdAt: string;
  lastModified: string;
}

export interface CanvasData {
  elements: DrawingElement[];
  background?: string;
}

export interface DrawingElement {
  id: string;
  type: "line" | "rectangle" | "circle" | "text" | "path" | "eraser";
  points: number[];
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color: string;
  lineWidth: number;
  isDragging?: boolean;
  creator?: string; // User ID who created the element
  createdAt?: Date;
}

export interface CanvasResponse {
  status: number;
  data: Canvas | Canvas[];
  message?: string;
}
