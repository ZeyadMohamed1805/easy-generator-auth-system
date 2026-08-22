import {
  PASSWORD_LETTER_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_NUMBER_PATTERN,
  PASSWORD_SPECIAL_PATTERN,
} from '@easygen/shared';
import type { PasswordCheck } from './PasswordHints.types';

export const PASSWORD_CHECKS: readonly PasswordCheck[] = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (value: string) => value.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'letter',
    label: 'At least one letter',
    test: (value: string) => PASSWORD_LETTER_PATTERN.test(value),
  },
  {
    id: 'number',
    label: 'At least one number',
    test: (value: string) => PASSWORD_NUMBER_PATTERN.test(value),
  },
  {
    id: 'special',
    label: 'At least one special character',
    test: (value: string) => PASSWORD_SPECIAL_PATTERN.test(value),
  },
];
