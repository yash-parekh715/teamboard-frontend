import React, { useState } from "react";
import Button from "./Buttons";
import { TextEditorModalProps } from "../Interfaces/TextEditorModalProps";

const TextEditorModal: React.FC<TextEditorModalProps> = ({
  onClose,
  onSave,
  initialText = "",
  initialStyle = {
    fontFamily: "Arial",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    color: "#000000",
  },
}) => {
  const [text, setText] = useState(initialText);
  const [fontFamily, setFontFamily] = useState(initialStyle.fontFamily);
  const [fontSize, setFontSize] = useState(initialStyle.fontSize);
  const [bold, setBold] = useState(initialStyle.bold);
  const [italic, setItalic] = useState(initialStyle.italic);
  const [underline, setUnderline] = useState(initialStyle.underline);
  const [color, setColor] = useState(initialStyle.color);

  const fontOptions = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
  ];

  const handleSave = () => {
    onSave({
      text,
      fontFamily,
      fontSize,
      bold,
      italic,
      underline,
      color,
    });
    onClose();
  };

  const previewStyle = {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    color,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Text Editor</h2>

        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 64, 72].map(
                (size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setBold(!bold)}
            className={`p-2 rounded ${bold ? "bg-purple-100" : "bg-gray-100"}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            onClick={() => setItalic(!italic)}
            className={`p-2 rounded ${
              italic ? "bg-purple-100" : "bg-gray-100"
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() => setUnderline(!underline)}
            className={`p-2 rounded ${
              underline ? "bg-purple-100" : "bg-gray-100"
            }`}
            title="Underline"
          >
            <span className="underline">U</span>
          </button>

          <div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-4 p-3 border border-gray-200 rounded bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">Preview:</p>
          <div style={previewStyle} className="min-h-[30px]">
            {text || "Preview text"}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextEditorModal;
