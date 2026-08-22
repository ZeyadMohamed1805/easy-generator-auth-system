import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import BootScreen from './BootScreen';

export default function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <BootScreen />;
  }
  if (user) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}
