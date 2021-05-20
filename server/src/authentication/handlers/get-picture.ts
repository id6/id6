import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { getUser } from '../utils/get-user';
import { authGuard } from '../guards/auth-guard';
import { join } from 'path';
import { NotFoundError } from '../../commons/errors/not-found-error';
import { ErrorCode } from '@id6/commons/build/error-code';
import { UPLOAD_DIR } from '../../storage/init-storage';

async function handler(req: Request, res: Response): Promise<void> {
  const user = getUser(req);

  if (!user.picture) {
    throw new NotFoundError('User has no picture', ErrorCode.picture_not_set);
  }

  res.download(join(UPLOAD_DIR, user.picture));
}

export const getPicture = [
  authGuard,
  wrapAsyncMiddleware(handler),
];
