import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type Toast = {
  id: number;
  message: string;
};

type ToastContextValue = {
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_MS = 6000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const showError = useCallback((message: string) => {
    const id = nextId.current;
    nextId.current += 1;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_MS);
  }, []);

  const value = useMemo(() => ({ showError }), [showError]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="assertive">
        {toasts.map((toast) => (
          <p key={toast.id} className="toast toast-error" role="alert">
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
