import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { object, string } from 'joi';
import { User } from '../../db/entities/user';
import { BadRequestError } from '../../commons/errors/bad-request-error';
import { MoreThan } from 'typeorm';
import { body } from '../../commons/express/body';
import { ErrorCode } from '@id6/commons/build/error-code';

const validators = [
  body(object({
    token: string().required(),
  })),
];

/*
// TODO
// could do in a single query but sqlite/postgres driver not implemented
const updateResult = await User.update({
  confirmed: false,
  confirmToken: token,
  confirmTokenExpiresAt: MoreThan(new Date()),
}, {
  confirmed: true,
  confirmToken: null,
  confirmTokenExpiresAt: null,
});
*/
async function handler(req: Request, res: Response): Promise<void> {
  const { token } = req.body;

  const count = await User.count({
    confirmed: false,
    confirmToken: token,
    confirmTokenExpiresAt: MoreThan(new Date()),
  });

  if (count === 0) {
    throw new BadRequestError('Invalid token', ErrorCode.invalid_token);
  }

  /*
   Cannot use UpdateResult because it's always empty for sqlit/postgres.
   Otherwise, we could remove the count above and check result.affected !== 0.
   https://github.com/typeorm/typeorm/issues/2415
   */
  await User.update({
    confirmed: false,
    confirmToken: token,
    confirmTokenExpiresAt: MoreThan(new Date()),
  }, {
    confirmed: true,
    confirmToken: null,
    confirmTokenExpiresAt: null,
  });

  res.status(204).send();
}

export const confirmEmail = [
  ...validators,
  wrapAsyncMiddleware(handler),
];
