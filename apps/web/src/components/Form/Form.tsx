import type { FormHTMLAttributes } from 'react';
import { cx } from '@/utils';
import styles from './Form.module.css';

export default function Form({
  className,
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form {...props} className={cx(styles.form, className)} noValidate>
      {children}
    </form>
  );
}
