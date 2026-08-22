import type { ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';

type AuthLayoutProps = {
  heading: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ heading, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <main className="panel">
        <BrandLogo />
        <h1 className="sr-only">{heading}</h1>
        {children}
        <p className="panel-footer">{footer}</p>
      </main>
    </div>
  );
}
