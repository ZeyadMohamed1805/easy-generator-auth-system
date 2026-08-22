import { describe, expect, it } from 'vitest';
import { passwordSchema } from './password';

describe('passwordSchema', () => {
  const valid = 'Abcd1234!';

  it.each([
    ['too short', 'Ab1!'],
    ['missing letter', '12345678!'],
    ['missing number', 'Abcdefgh!'],
    ['missing special character', 'Abcd1234'],
    ['empty', ''],
  ])('rejects %s', (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false);
  });

  it.each([
    ['basic policy', valid],
    ['unicode letter with special', 'Äbcd1234!'],
    ['punctuation other than !', 'Abcd1234@'],
    ['space as special character', 'Abcd1234 '],
  ])('accepts %s', (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(true);
  });

  it('reports the first failing rule for a short password', () => {
    const result = passwordSchema.safeParse('a1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/at least 8/i);
    }
  });
});
