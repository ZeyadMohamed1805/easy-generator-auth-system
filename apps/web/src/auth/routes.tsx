import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="boot" role="status" aria-live="polite">
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="boot" role="status" aria-live="polite">
        Loading…
      </div>
    );
  }
  if (user) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}
