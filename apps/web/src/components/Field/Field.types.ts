import type { ReactElement } from 'react';

export type FieldProps = {
  label: string;
  error?: string;
  valid?: boolean;
  disabled?: boolean;
  children: ReactElement<Record<string, unknown>>;
};
