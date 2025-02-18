export type FieldType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "checkbox"
  | "textarea";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | null;
}
