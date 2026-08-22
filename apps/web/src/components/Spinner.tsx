type SpinnerProps = {
  label?: string;
  size?: 'md' | 'lg';
};

export function Spinner({ label, size = 'md' }: SpinnerProps) {
  return (
    <span className="spinner-wrap">
      <span
        className={size === 'lg' ? 'spinner spinner-lg' : 'spinner'}
        aria-hidden="true"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
