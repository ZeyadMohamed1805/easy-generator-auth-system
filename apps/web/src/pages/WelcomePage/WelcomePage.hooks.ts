import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { reportApiError } from '@/helpers/report-api-error';

export function useLogout() {
  const { signOut } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await signOut();
      void navigate('/sign-in');
    } catch (error) {
      reportApiError(error, showError);
      setBusy(false);
    }
  }

  return { busy, logout };
}
