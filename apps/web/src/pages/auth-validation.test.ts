import { signInSchema, signUpSchema } from '@easygen/shared';
import { describe, expect, it } from 'vitest';

describe('sign-up form schema (same contract as SignUpPage)', () => {
  it('rejects a name shorter than 3 characters', () => {
    const result = signUpSchema.safeParse({
      name: 'Al',
      email: 'ada@example.com',
      password: 'Abcd1234!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toMatch(/at least 3/i);
    }
  });

  it('rejects a password with no special character', () => {
    const result = signUpSchema.safeParse({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Abcd1234',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toMatch(
        /special character/i,
      );
    }
  });
});

describe('sign-in form schema (same contract as SignInPage)', () => {
  it('requires a password without applying the full policy', () => {
    const empty = signInSchema.safeParse({
      email: 'ada@example.com',
      password: '',
    });
    expect(empty.success).toBe(false);

    const short = signInSchema.safeParse({
      email: 'ada@example.com',
      password: 'x',
    });
    expect(short.success).toBe(true);
  });
});
