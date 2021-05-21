import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';
import { env } from '../../env/env';
import { timingSafeEqual } from 'crypto';
import { ErrorCode } from '@id6/commons/build/error-code';

const secret = Buffer.from(env.ID6_AUTHORIZATION_SECRET);

export async function authorize(req: Request, res: Response, next: NextFunction) {
  const token: string = req.headers.authorization;

  if (!token) {
    return next(new UnauthorizedError('No token provided', ErrorCode.no_token_provided));
  }

  const tokenBuffer = Buffer.alloc(secret.length, token);

  if (!timingSafeEqual(tokenBuffer, secret)) {
    return next(new UnauthorizedError('Invalid secret', ErrorCode.invalid_token));
  }

  next();
}
