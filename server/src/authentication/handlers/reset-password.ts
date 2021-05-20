import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { body } from '../../commons/express/body';
import { object, string } from 'joi';
import { $password, User } from '../../db/entities/user';
import { hash } from '../utils/password';
import { MoreThan } from 'typeorm';
import { NotFoundError } from '../../commons/errors/not-found-error';
import { ErrorCode } from '@id6/commons/build/error-code';

const validators = [
  body(object({
    token: string().required(),
    password: $password,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { token, password } = req.body;

  const count = await User.count({
    where: {
      resetToken: token,
      resetTokenExpiresAt: MoreThan(new Date()),
    },
  });

  if (count === 0) {
    throw new NotFoundError('User not found', ErrorCode.user_not_found);
  }

  await User.update({
    resetToken: token,
    resetTokenExpiresAt: MoreThan(new Date()),
  }, {
    password: await hash(password),
    resetToken: null,
    resetTokenExpiresAt: null,
  });

  res.status(204).send();
}

export const resetPassword = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
