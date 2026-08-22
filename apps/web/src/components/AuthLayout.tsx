import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="shell">
      <aside className="brand" aria-label="Product">
        <p className="brand-kicker">Easy Generator</p>
        <h1>A quiet door into your workspace.</h1>
        <p>
          Create an account or sign in. Field rules are the same on this page and on
          the server — no surprises after submit.
        </p>
        <Link className="brand-home" to="/sign-in">
          Auth module
        </Link>
      </aside>
      <main className="panel">
        <header className="panel-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </header>
        {children}
        <p className="panel-footer">{footer}</p>
      </main>
    </div>
  );
}
