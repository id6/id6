import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { body } from '../../commons/express/body';
import { object, string } from 'joi';
import { $language, $password, User } from '../../db/entities/user';
import { sendConfirmEmail } from '../../emails/send-confirm-email';
import { env } from '../../env/env';
import { generateRandomToken } from '../utils/generate-random-token';
import { hash } from '../utils/password';
import { BadRequestError } from '../../commons/errors/bad-request-error';
import { ErrorCode } from '@id6/commons/build/error-code';
import { StrategyType } from '@id6/commons/build/strategy-type';

const validators = [
  body(object({
    email: string().required().email(),
    name: string().optional().empty('').empty(null),
    password: $password,
    language: $language,
  })),
];

// TODO single query when this is fixed: https://github.com/typeorm/typeorm/issues/2415
async function handler(req: Request, res: Response): Promise<void> {
  const { name, email, password, language } = req.body;

  const count = await User.count({
    where: {
      authProvider: StrategyType.local,
      externalUserId: email,
    },
  });

  if (count !== 0) {
    throw new BadRequestError('Email already in use', ErrorCode.email_in_use);
  }

  const token = generateRandomToken();

  await User
    .create({
      authProvider: StrategyType.local,
      externalUserId: email,
      email,
      name,
      language,
      password: await hash(password),
      confirmToken: token,
      confirmTokenExpiresAt: new Date(Date.now() + env.ID6_TOKEN_EXPIRATION),
    })
    .save();

  await sendConfirmEmail(email, language, {
    url: `${env.ID6_URL}/email/confirm?token=${token}`,
  });

  res.status(204).send();
}

export const register = [
  // TODO captcha
  ...validators,
  wrapAsyncMiddleware(handler),
];
