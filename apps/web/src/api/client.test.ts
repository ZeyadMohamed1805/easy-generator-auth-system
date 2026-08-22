import { describe, expect, it } from 'vitest';
import { messagesFromBody } from '../api/client';

describe('API error messages', () => {
  it('reads string and array bodies from the API error shape', () => {
    expect(messagesFromBody({ message: 'Invalid credentials' })).toEqual([
      'Invalid credentials',
    ]);
    expect(messagesFromBody({ message: ['Name is required.', 'Too short'] })).toEqual(
      ['Name is required.', 'Too short'],
    );
  });
});
