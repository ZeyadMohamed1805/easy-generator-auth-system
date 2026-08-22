import { useCallback, useMemo, useRef, useState } from 'react';
import { cx } from '@/utils';
import { ToastContext } from './ToastContext';
import { TOAST_MS } from './ToastProvider.constants';
import styles from './ToastProvider.module.css';
import type { Toast, ToastProviderProps } from './ToastProvider.types';

export default function ToastProvider({ children }: ToastProviderProps) {
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
      <div className={styles.stack} aria-live="assertive">
        {toasts.map((toast) => (
          <p key={toast.id} className={cx(styles.toast, styles.error)} role="alert">
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
