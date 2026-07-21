// src/context/ErrorToastContext.jsx
import { useState, useCallback } from "react";
import { ErrorToastContext } from "./ErrorToastContextValue";

let idCounter = 0;

export function ErrorToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showError = useCallback(
    (err, title = "Something went wrong") => {
      const status = err?.response?.status ?? null;
      const message = err?.response?.data?.message || "Please try again.";
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, status, message }]);
      setTimeout(() => dismiss(id), 6000);
    },
    [dismiss]
  );

  return (
    <ErrorToastContext.Provider value={{ toasts, showError, dismiss }}>
      {children}
    </ErrorToastContext.Provider>
  );
}