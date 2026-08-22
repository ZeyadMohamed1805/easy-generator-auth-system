import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@easygen/shared';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { reportApiError } from '@/helpers/report-api-error';

export function useSignInForm() {
  const { signIn } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn(values);
      void navigate('/app');
    } catch (error) {
      reportApiError(error, showError);
    }
  });

  return { ...form, onSubmit };
}
