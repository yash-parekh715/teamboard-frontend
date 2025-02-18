import { FormField } from "./FormField";
export interface FormComponentProps {
  title: string;
  fields: FormField[];
  submitButtonText: string;
  onSubmit: (data: Record<string, any>) => void;
  loadingState?: boolean;
  successMessage?: string;
  errorMessage?: string;
  links?: Array<{ text: string; url: string }>;
  className?: string;
}
