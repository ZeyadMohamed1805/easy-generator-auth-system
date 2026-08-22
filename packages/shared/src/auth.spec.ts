import { describe, expect, it } from 'vitest';
import { signInSchema, signUpSchema } from './auth';
import { emailSchema } from './email';
import { nameSchema } from './name';

describe('emailSchema', () => {
  it('lowercases a valid address', () => {
    expect(emailSchema.parse('  Alex@Example.COM ')).toBe('alex@example.com');
  });

  it('rejects an invalid address', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('nameSchema', () => {
  it('trims and accepts three characters', () => {
    expect(nameSchema.parse('  Ada  ')).toBe('Ada');
  });

  it('rejects two characters', () => {
    expect(nameSchema.safeParse('Al').success).toBe(false);
  });
});

describe('signUpSchema', () => {
  it('parses a valid payload', () => {
    expect(
      signUpSchema.parse({
        email: 'Ada@Example.com',
        name: '  Ada Lovelace  ',
        password: 'Abcd1234!',
      }),
    ).toEqual({
      email: 'ada@example.com',
      name: 'Ada Lovelace',
      password: 'Abcd1234!',
    });
  });
});

describe('signInSchema', () => {
  it('does not require the full password policy', () => {
    expect(
      signInSchema.parse({ email: 'ada@example.com', password: 'x' }),
    ).toEqual({ email: 'ada@example.com', password: 'x' });
  });
});
