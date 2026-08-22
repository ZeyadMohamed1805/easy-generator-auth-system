import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@easygen/shared';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthProvider';
import { AuthLayout } from '../components/AuthLayout';
import { Field } from '../components/Field';
import { PasswordHints } from '../components/PasswordHints';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

type SignUpForm = {
  email: string;
  name: string;
  password: string;
};

export function SignUpPage() {
  const { signUp } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: { email: '', name: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signUp(values);
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
      heading="Create an account"
      footer={
        <>
          Already registered? <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      <form className="form" onSubmit={onSubmit} noValidate>
        <Field
          label="Name"
          error={errors.name?.message}
          valid={Boolean(touchedFields.name && !errors.name)}
          disabled={isSubmitting}
        >
          <input autoComplete="name" {...register('name')} />
        </Field>
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
            autoComplete="new-password"
            {...register('password')}
          />
        </Field>
        <PasswordHints value={watch('password')} />
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
