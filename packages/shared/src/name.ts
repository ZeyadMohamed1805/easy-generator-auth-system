import { z } from 'zod';

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 100;

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, `Name must be at least ${NAME_MIN_LENGTH} characters.`)
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters.`);

export type Name = z.infer<typeof nameSchema>;
