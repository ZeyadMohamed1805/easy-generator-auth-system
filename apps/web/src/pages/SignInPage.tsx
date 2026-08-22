import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@easygen/shared';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { AuthLayout } from '../components/AuthLayout';
import { Field } from '../components/Field';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

type SignInForm = {
  email: string;
  password: string;
};

export function SignInPage() {
  const { signIn } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signIn(values);
      void navigate('/app');
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.messages.join(' '));
        return;
      }
      showError('Something went wrong. Please try again.');
    }
  });

  return (
    <AuthLayout
      heading="Sign in"
      footer={
        <>
          New here? <Link to="/sign-up">Create an account</Link>
        </>
      }
    >
      <form className="form" onSubmit={onSubmit} noValidate>
        <Field
          label="Email"
          error={errors.email?.message}
          valid={Boolean(touchedFields.email && !errors.email)}
          disabled={isSubmitting}
        >
          <input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field
          label="Password"
          error={errors.password?.message}
          valid={Boolean(touchedFields.password && !errors.password)}
          disabled={isSubmitting}
        >
          <input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </Field>
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
