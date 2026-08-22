import type { PublicUser, SignInInput, SignUpInput } from '@easygen/shared';
import { api } from './client';

export type SessionResponse = {
  user: PublicUser;
};

export function fetchCurrentUser(): Promise<PublicUser> {
  return api<PublicUser>('/api/users/me');
}

export function signUpRequest(input: SignUpInput): Promise<SessionResponse> {
  return api<SessionResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function signInRequest(input: SignInInput): Promise<SessionResponse> {
  return api<SessionResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function signOutRequest(): Promise<void> {
  return api<void>('/api/auth/logout', { method: 'POST' });
}
