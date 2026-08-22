import { z } from 'zod';
import { emailSchema } from './email';
import { nameSchema } from './name';
import { passwordSchema, signInPasswordSchema } from './password';

export const signUpSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});

export const publicUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
