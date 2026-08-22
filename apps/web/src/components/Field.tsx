import { cloneElement, useId, type ReactElement } from 'react';

type FieldProps = {
  label: string;
  error?: string;
  children: ReactElement<Record<string, unknown>>;
};

export function Field({ label, error, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
