"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext({ notify: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

/** Minimal, accessible toast: one message at a time in a polite live region. */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const notify = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ message, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 md:bottom-6"
      >
        {toast && (
          <p
            key={toast.key}
            className="animate-toast max-w-sm rounded-full bg-ink px-4 py-2.5 text-center text-xs font-medium text-bg shadow-float"
          >
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}
