import type { PublicUser, SignInInput, SignUpInput } from '@easygen/shared';
import type { ReactNode } from 'react';

export type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthProviderProps = {
  children: ReactNode;
};
