export interface ErrorAlertProps {
  error: string | Error | null;
  onClose?: () => void;
  title?: string;
  className?: string;
  autoHideDuration?: number;
}
