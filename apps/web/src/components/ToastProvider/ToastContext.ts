import { createContext } from 'react';
import type { ToastContextValue } from './ToastProvider.types';

export const ToastContext = createContext<ToastContextValue | null>(null);
