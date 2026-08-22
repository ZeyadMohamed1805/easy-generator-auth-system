import {
  PASSWORD_LETTER_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_NUMBER_PATTERN,
  PASSWORD_SPECIAL_PATTERN,
} from '@easygen/shared';

const checks = [
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

export function PasswordHints({ value }: { value: string }) {
  return (
    <ul className="hints" aria-label="Password requirements">
      {checks.map((check) => {
        const met = value.length > 0 && check.test(value);
        return (
          <li key={check.id} data-met={met ? 'true' : 'false'}>
            {check.label}
          </li>
        );
      })}
    </ul>
  );
}
