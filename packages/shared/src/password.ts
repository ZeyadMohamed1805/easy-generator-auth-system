import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_LETTER_PATTERN = /[A-Za-z]/;
export const PASSWORD_NUMBER_PATTERN = /[0-9]/;
export const PASSWORD_SPECIAL_PATTERN = /[^A-Za-z0-9]/;

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  )
  .regex(PASSWORD_LETTER_PATTERN, 'Password must include at least one letter.')
  .regex(PASSWORD_NUMBER_PATTERN, 'Password must include at least one number.')
  .regex(
    PASSWORD_SPECIAL_PATTERN,
    'Password must include at least one special character.',
  );

/** Sign-in only: do not apply the full policy (avoids leaking why credentials failed). */
export const signInPasswordSchema = z.string().min(1, 'Password is required.');

export type Password = z.infer<typeof passwordSchema>;
