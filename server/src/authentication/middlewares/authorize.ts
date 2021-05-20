import { NextFunction, Request, Response } from 'express';
import { authCookieName, removeAuthCookie } from '../cookie';
import { Logger } from '../../commons/logger/logger';
import { verifyToken } from '../utils/verify-token';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';

const logger = new Logger('id6.api:authorize');

async function handler(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[authCookieName];

  if (!token) {
    logger.debug('no token found in request');
    next();
    return;
  }

  logger.debug('found token in request', token);

  const { user, error } = await verifyToken(token);

  if (error) {
    removeAuthCookie(res);
    throw new UnauthorizedError(error.message, error.code);
  }

  logger.debug('setting req.user with', user);

  req.user = user;

  next();
}

export const authorize = [
  wrapAsyncMiddleware(handler),
];
