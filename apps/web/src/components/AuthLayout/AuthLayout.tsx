import BrandLogo from '@/components/BrandLogo';
import styles from './AuthLayout.module.css';
import type { AuthLayoutProps } from './AuthLayout.types';

export default function AuthLayout({
  heading,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <main className={styles.panel}>
        <BrandLogo />
        <h1 className="sr-only">{heading}</h1>
        {children}
        <p className={styles.footer}>{footer}</p>
      </main>
    </div>
  );
}
