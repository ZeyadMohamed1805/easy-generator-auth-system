import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export function WelcomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function onLogout() {
    setBusy(true);
    try {
      await signOut();
      void navigate('/sign-in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="welcome">
      <header className="welcome-bar">
        <p className="brand-kicker">Easy Generator</p>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => void onLogout()}
          disabled={busy}
        >
          {busy ? 'Signing out…' : 'Log out'}
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
