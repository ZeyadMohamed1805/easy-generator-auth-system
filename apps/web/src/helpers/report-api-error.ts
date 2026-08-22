import { ApiError } from '@/api/client';

export function reportApiError(
  error: unknown,
  showError: (message: string) => void,
): void {
  if (error instanceof ApiError) {
    showError(error.messages.join(' '));
    return;
  }
  showError('Something went wrong. Please try again.');
}
