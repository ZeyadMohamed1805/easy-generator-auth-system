import Spinner from '@/components/Spinner';
import { cx } from '@/utils';
import styles from './Button.module.css';
import type { ButtonProps } from './Button.types';

export default function Button({
  variant = 'primary',
  busy = false,
  busyLabel,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(styles.button, variant === 'ghost' && styles.ghost, className)}
      disabled={disabled || busy}
      type={type}
    >
      {busy ? (
        <>
          <Spinner className={styles.spinner} />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
