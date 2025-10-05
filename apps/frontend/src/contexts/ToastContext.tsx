import React, { createContext, useContext, useState } from "react";

type Toast = { id: string; message: string };

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: string) => void;
} | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(message: string) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => removeToast(id), 4000);
  }

  function removeToast(id: string) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#333",
              color: "#fff",
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastContext;
