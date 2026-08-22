import BrandLogo from '@/components/BrandLogo';
import Button from '@/components/Button';
import { useAuth } from '@/components/AuthProvider';
import { useLogout } from './WelcomePage.hooks';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  const { user } = useAuth();
  const { busy, logout } = useLogout();

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <BrandLogo compact />
        <Button
          className={styles.logout}
          variant="ghost"
          type="button"
          busy={busy}
          busyLabel="Signing out…"
          onClick={() => void logout()}
        >
          Log out
        </Button>
      </header>
      <main className={styles.card}>
        <p className={styles.eyebrow}>
          You are signed in{user ? ` as ${user.name}` : ''}
        </p>
        <h1>Welcome to the application.</h1>
        <p className={styles.muted}>
          This page is behind a protected API call. Signing out ends the session
          on the server and in this browser.
        </p>
      </main>
    </div>
  );
}
