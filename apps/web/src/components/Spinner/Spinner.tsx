import { cx } from '@/utils';
import styles from './Spinner.module.css';
import type { SpinnerProps } from './Spinner.types';

export default function Spinner({
  label,
  size = 'md',
  className,
}: SpinnerProps) {
  return (
    <span className={styles.wrap}>
      <span
        className={cx(styles.spinner, size === 'lg' && styles.lg, className)}
        aria-hidden="true"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
