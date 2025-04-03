export interface TextEditorModalProps {
  onClose: () => void;
  onSave: (textData: {
    text: string;
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  }) => void;
  initialText?: string;
  initialStyle?: {
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  };
}
