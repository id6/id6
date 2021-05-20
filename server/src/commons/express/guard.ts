import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';
import { ErrorCode } from '@id6/commons/build/error-code';

export function guard(
  check: (req: Request) => Promise<boolean>,
  message: string,
  errorCode: ErrorCode,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    check(req)
      .then(isAllowed => next(isAllowed ? undefined : new ForbiddenError(message, errorCode)))
      .catch(next);
  };
}
