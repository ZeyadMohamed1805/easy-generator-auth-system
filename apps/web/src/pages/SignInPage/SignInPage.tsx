import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Field from '@/components/Field';
import Form from '@/components/Form';
import { useSignInForm } from './SignInPage.hooks';

export default function SignInPage() {
  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useSignInForm();

  return (
    <AuthLayout
      heading="Sign in"
      footer={
        <>
          New here? <Link to="/sign-up">Create an account</Link>
        </>
      }
    >
      <Form onSubmit={onSubmit}>
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
        <Button type="submit" busy={isSubmitting} busyLabel="Signing in…">
          Sign in
        </Button>
      </Form>
    </AuthLayout>
  );
}
