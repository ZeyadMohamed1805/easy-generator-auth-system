import { cloneElement, useId } from 'react';
import styles from './Field.module.css';
import type { FieldProps } from './Field.types';

export default function Field({
  label,
  error,
  valid,
  disabled,
  children,
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={styles.field} data-valid={valid ? 'true' : undefined}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        disabled,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
