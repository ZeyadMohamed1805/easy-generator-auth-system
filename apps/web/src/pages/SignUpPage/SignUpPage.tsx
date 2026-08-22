import { Link } from 'react-router-dom';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import Field from '@/components/Field';
import Form from '@/components/Form';
import PasswordHints from '@/components/PasswordHints';
import { useSignUpForm } from './SignUpPage.hooks';

export default function SignUpPage() {
  const {
    register,
    watch,
    onSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useSignUpForm();

  return (
    <AuthLayout
      heading="Create an account"
      footer={
        <>
          Already registered? <Link to="/sign-in">Sign in</Link>
        </>
      }
    >
      <Form onSubmit={onSubmit}>
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
        <Button type="submit" busy={isSubmitting} busyLabel="Creating account…">
          Create account
        </Button>
      </Form>
    </AuthLayout>
  );
}
