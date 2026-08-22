import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpInput } from '@easygen/shared';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ToastProvider';
import { reportApiError } from '@/helpers/report-api-error';

export function useSignUpForm() {
  const { signUp } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: { email: '', name: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signUp(values);
      void navigate('/app');
    } catch (error) {
      reportApiError(error, showError);
    }
  });

  return { ...form, onSubmit };
}
