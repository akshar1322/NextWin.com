// components/ui/use-toast.tsx
"use client";

import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";

export interface ToastProps {
  id?: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
  className?: string;
}

interface ToastContextType {
  toasts: ToastProps[];
  toast: (props: ToastProps) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (props: ToastProps) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...props }]);

      setTimeout(() => removeToast(id), props.duration || 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

