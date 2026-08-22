import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PublicUser, SignInInput, SignUpInput } from '@easygen/shared';
import { ApiError } from '../api/client';
import {
  fetchCurrentUser,
  signInRequest,
  signOutRequest,
  signUpRequest,
} from '../api/auth';

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser()
      .then((current) => {
        if (!cancelled) {
          setUser(current);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled && error instanceof ApiError && error.statusCode === 401) {
          setUser(null);
          return;
        }
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const result = await signUpRequest(input);
    setUser(result.user);
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const result = await signInRequest(input);
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await signOutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut }),
    [user, loading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
