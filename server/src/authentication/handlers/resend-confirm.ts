import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { body } from '../../commons/express/body';
import { object, string } from 'joi';
import { User } from '../../db/entities/user';
import { sendConfirmEmail } from '../../emails/send-confirm-email';
import { env } from '../../env/env';
import { generateRandomToken } from '../utils/generate-random-token';
import { BadRequestError } from '../../commons/errors/bad-request-error';
import { ErrorCode } from '@id6/commons/build/error-code';
import { StrategyType } from '@id6/commons/build/strategy-type';

const validators = [
  body(object({
    email: string().required().email(),
  })),
];

// TODO single query when this is fixed: https://github.com/typeorm/typeorm/issues/2415
async function handler(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      authProvider: StrategyType.local,
      externalUserId: email,
    },
  });

  if (!user) {
    throw new BadRequestError('User not found', ErrorCode.user_not_found);
  }

  if (user.confirmed) {
    throw new BadRequestError('Email already confirmed', ErrorCode.email_already_confirmed);
  }

  const token = generateRandomToken();

  await User.update({
    authProvider: StrategyType.local,
    externalUserId: email,
  }, {
    confirmToken: token,
    confirmTokenExpiresAt: new Date(Date.now() + env.ID6_TOKEN_EXPIRATION),
  });

  await sendConfirmEmail(email, user.language, {
    url: `${env.ID6_URL}/email/confirm?token=${token}`,
  });

  res.status(204).send();
}

export const resendConfirm = [
  // TODO captcha
  ...validators,
  wrapAsyncMiddleware(handler),
];
