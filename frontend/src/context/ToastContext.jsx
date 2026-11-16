import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 ${
                isSuccess
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
                  : isError
                  ? 'bg-rose-950/90 text-rose-100 border-rose-800'
                  : 'bg-slate-900/90 text-slate-100 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                {isError && <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                {isInfo && <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                <p className="text-xs font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

