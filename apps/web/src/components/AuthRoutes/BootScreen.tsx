import Spinner from '@/components/Spinner';
import styles from './BootScreen.module.css';

export default function BootScreen() {
  return (
    <div className={styles.boot} role="status" aria-live="polite">
      <Spinner size="lg" label="Loading" />
    </div>
  );
}
