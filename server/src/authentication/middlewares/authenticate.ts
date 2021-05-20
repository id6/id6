import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authCookieName, getCookieOptions } from '../cookie';
import { env } from '../../env/env';
import { User } from '../../db/entities/user';

export interface JwtTokenPayload {
  userId: number;
  issuedAt: number;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const user: User = req.user as User;

  const tokenPayload: JwtTokenPayload = {
    userId: user.id,
    issuedAt: Date.now(),
  };

  // https://www.npmjs.com/package/jsonwebtoken#usage
  jwt.sign(tokenPayload, env.ID6_JWT_SECRET, { algorithm: 'HS256' }, (err, token) => {
    if (err) {
      return next(err);
    }

    res.cookie(authCookieName, token, getCookieOptions());

    next();
  });
}
