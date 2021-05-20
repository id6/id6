import { Handler } from 'express';
import { object, string } from 'joi';
import { body } from '../../commons/express/body';
import { verifyToken } from '../../authentication/utils/verify-token';
import { authorize } from '../middlewares/authorize';

export const authorizeUser: Handler[] = [
  authorize,
  body(object({
    token: string().required(),
  })),
  (req, res, next) => {
    verifyToken(req.body.token)
      .then(({ user, error }) => {
        res.json({
          error,
          user: user ? {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            authProvider: user.authProvider,
            externalUserId: user.externalUserId,
            name: user.name,
            email: user.email,
            invalidateTokensAt: user.invalidateTokensAt,
          } : undefined,
        });
      })
      .catch(next);
  },
];
