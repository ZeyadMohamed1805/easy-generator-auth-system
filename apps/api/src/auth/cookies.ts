import type { Response } from 'express';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './auth.constants';

export type CookieSettings = {
  secure: boolean;
  accessTtlSeconds: number;
  refreshTtlDays: number;
};

const cookieBase = (settings: CookieSettings) => ({
  httpOnly: true as const,
  secure: settings.secure,
  sameSite: 'lax' as const,
  path: '/',
});

export function setAuthCookies(
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
  settings: CookieSettings,
): void {
  const base = cookieBase(settings);
  response.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: settings.accessTtlSeconds * 1000,
  });
  response.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: settings.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(
  response: Response,
  settings: CookieSettings,
): void {
  const base = cookieBase(settings);
  response.clearCookie(ACCESS_COOKIE, base);
  response.clearCookie(REFRESH_COOKIE, base);
}
