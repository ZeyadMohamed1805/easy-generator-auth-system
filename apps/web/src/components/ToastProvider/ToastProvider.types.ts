import type { ReactNode } from 'react';

export type Toast = {
  id: number;
  message: string;
};

export type ToastContextValue = {
  showError: (message: string) => void;
};

export type ToastProviderProps = {
  children: ReactNode;
};
