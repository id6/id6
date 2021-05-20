import { env } from '../env/env';
import { Response } from 'express';

export const authCookieName = 'auth';

export function getCookieOptions(maxAge = env.ID6_JWT_TOKEN_EXPIRATION) {
  return {
    httpOnly: true,
    path: '/',
    expires: new Date(new Date().getTime() + maxAge),
    maxAge,
    secure: env.ID6_COOKIE_SECURE,
    sameSite: env.ID6_COOKIE_SAMESITE,
  };
}

export function removeAuthCookie(res: Response) {
  res.cookie(authCookieName, '', getCookieOptions(0));
}
