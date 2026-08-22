import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Spinner } from '../components/Spinner';

function BootScreen() {
  return (
    <div className="boot" role="status" aria-live="polite">
      <Spinner size="lg" label="Loading" />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <BootScreen />;
  }
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <BootScreen />;
  }
  if (user) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}
