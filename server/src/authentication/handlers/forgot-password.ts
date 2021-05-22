import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { body } from '../../commons/express/body';
import { object, string } from 'joi';
import { User } from '../../db/entities/user';
import { BadRequestError } from '../../commons/errors/bad-request-error';
import { env } from '../../env/env';
import { generateRandomToken } from '../utils/generate-random-token';
import { sendForgotPassword } from '../../emails/send-forgot-password';
import { ErrorCode } from '@id6/commons/build/error-code';
import { StrategyType } from '@id6/commons/build/strategy-type';

const validators = [
  body(object({
    email: string().required().email(),
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  const count = await User.count({
    where: {
      authProvider: StrategyType.local,
      externalUserId: email,
    },
  });

  if (count === 0) {
    throw new BadRequestError('User not found', ErrorCode.user_not_found);
  }

  const token = generateRandomToken();

  await User.update({
    authProvider: StrategyType.local,
    externalUserId: email,
  }, {
    resetToken: token,
    resetTokenExpiresAt: new Date(Date.now() + env.ID6_TOKEN_EXPIRATION),
  });

  const user = await User.findOne({
    where: {
      authProvider: StrategyType.local,
      externalUserId: email,
    },
  });

  await sendForgotPassword(email, user.email, {
    url: `${env.ID6_URL}/password/reset?token=${token}`,
  });

  res.status(204).send();
}

export const forgotPassword = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
