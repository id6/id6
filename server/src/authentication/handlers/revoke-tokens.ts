import { Request, Response } from 'express';
import { User } from '../../db/entities/user';
import { getUser } from '../utils/get-user';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { authGuard } from '../guards/auth-guard';
import { removeAuthCookie } from '../cookie';

async function handler(req: Request, res: Response) {
  const { id } = getUser(req);

  await User.update({
    id,
  }, {
    invalidateTokensAt: new Date(),
  });

  removeAuthCookie(res);

  res.status(204).send();
}

export const revokeTokens = [
  authGuard,
  wrapAsyncMiddleware(handler),
];
