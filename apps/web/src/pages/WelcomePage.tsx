import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { BrandLogo } from '../components/BrandLogo';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

export function WelcomePage() {
  const { user, signOut } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function onLogout() {
    setBusy(true);
    try {
      await signOut();
      void navigate('/sign-in');
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.messages.join(' '));
      } else {
        showError('Something went wrong. Please try again.');
      }
      setBusy(false);
    }
  }

  return (
    <div className="welcome">
      <header className="welcome-bar">
        <BrandLogo compact />
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => void onLogout()}
          disabled={busy}
        >
          {busy ? (
            <>
              <Spinner />
              Signing out…
            </>
          ) : (
            'Log out'
          )}
        </button>
      </header>
      <main className="welcome-card">
        <p className="eyebrow">You are signed in{user ? ` as ${user.name}` : ''}</p>
        <h1>Welcome to the application.</h1>
        <p className="muted">
          This page is behind a protected API call. Signing out ends the session
          on the server and in this browser.
        </p>
      </main>
    </div>
  );
}
