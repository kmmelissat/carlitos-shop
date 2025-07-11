"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-hide after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      "rounded-lg shadow-lg border p-4 flex items-center space-x-3 min-w-[320px] max-w-md";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <span className="material-icons-round text-green-600">
            check_circle
          </span>
        );
      case "error":
        return <span className="material-icons-round text-red-600">error</span>;
      case "warning":
        return (
          <span className="material-icons-round text-yellow-600">warning</span>
        );
      case "info":
        return <span className="material-icons-round text-blue-600">info</span>;
      default:
        return (
          <span className="material-icons-round text-gray-600">
            notifications
          </span>
        );
    }
  };

  return (
    <div
      className={`transition-all duration-300 transform ${
        isVisible && !isExiting
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0"
      }`}
    >
      <div className={getToastStyles()}>
        {getIcon()}
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="material-icons-round text-lg">close</span>
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Handle hydration and make addToast available globally
  useEffect(() => {
    setIsMounted(true);
    (window as any).addToast = addToast;
    return () => {
      delete (window as any).addToast;
    };
  }, []);

  // Don't render on server or before hydration
  if (!isMounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
};

// Helper function to show toasts
export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration?: number
) => {
  if (typeof window !== "undefined" && (window as any).addToast) {
    (window as any).addToast({ message, type, duration });
  }
};

export default Toast;
