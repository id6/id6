import { NextFunction, Request, Response } from 'express';
import { getUser } from '../utils/get-user';
import { UnauthorizedError } from '../../commons/errors/unauthorized-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const user = getUser(req);
  if (user) {
    next(undefined);
  } else {
    next(new UnauthorizedError('You are not authenticated', ErrorCode.not_authenticated));
  }
}
