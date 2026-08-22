import { PASSWORD_CHECKS } from './PasswordHints.constants';
import styles from './PasswordHints.module.css';
import type { PasswordHintsProps } from './PasswordHints.types';

export default function PasswordHints({ value }: PasswordHintsProps) {
  return (
    <ul className={styles.hints} aria-label="Password requirements">
      {PASSWORD_CHECKS.map((check) => {
        const met = value.length > 0 && check.test(value);
        return (
          <li key={check.id} data-met={met ? 'true' : 'false'}>
            {check.label}
          </li>
        );
      })}
    </ul>
  );
}
