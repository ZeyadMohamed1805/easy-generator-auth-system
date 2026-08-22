import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@easygen/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { AuthLayout } from '../components/AuthLayout';
import { Field } from '../components/Field';

type SignInForm = {
  email: string;
  password: string;
};

export function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn(values);
      void navigate('/app');
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.messages.join(' '));
        return;
      }
      setServerError('Something went wrong. Please try again.');
    }
  });

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use the email and password you registered with."
      footer={
        <>
          New here? <Link to="/sign-up">Create an account</Link>
        </>
      }
    >
      <form className="form" onSubmit={onSubmit} noValidate>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </Field>
        {serverError ? (
          <p className="form-error" role="alert">
            {serverError}
          </p>
        ) : null}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
