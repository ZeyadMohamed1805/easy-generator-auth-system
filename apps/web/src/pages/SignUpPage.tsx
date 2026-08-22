import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@easygen/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { AuthLayout } from '../components/AuthLayout';
import { Field } from '../components/Field';
import { PasswordHints } from '../components/PasswordHints';

type SignUpForm = {
  email: string;
  name: string;
  password: string;
};

export function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', name: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signUp(values);
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
      title="Create an account"
      subtitle="Name, email, and a password that meets the rules below."
      footer={
        <>
          Already registered? <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      <form className="form" onSubmit={onSubmit} noValidate>
        <Field label="Name" error={errors.name?.message}>
          <input
            autoComplete="name"
            {...register('name')}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register('email')}
          />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
        </Field>
        <PasswordHints value={watch('password')} />
        {serverError ? (
          <p className="form-error" role="alert">
            {serverError}
          </p>
        ) : null}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
