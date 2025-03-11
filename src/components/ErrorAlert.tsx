import React from "react";
import Icons from "./UI/Icons";
import { BiErrorCircle } from "react-icons/bi";
import { useState, useEffect } from "react";
import { ErrorAlertProps } from "./Interfaces/ErrorAlertPRops";

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onClose,
  title = "Error",
  className = "",
  autoHideDuration = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);

      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, autoHideDuration);

        return () => clearTimeout(timer);
      }
    }
  }, [error, autoHideDuration, onClose]);

  if (!error) return null;

  return (
    <div
      role="alert"
      className={`
        fixed bottom-4 right-4 z-50 max-w-sm
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        bg-white rounded-lg border border-red-600 shadow-lg
        ${className}
      `}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <BiErrorCircle className="h-5 w-5 text-red-600" />
        </div>

        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-600">{title}</h3>

          <div className="mt-2 text-sm text-red-600">
            {typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred"}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-purple-50 text-red-600"
          >
            <Icons.Close className="w-[1.75rem] h-[0.85rem]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
