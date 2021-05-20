import { Request, Response } from 'express';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';
import { body } from '../../commons/express/body';
import { object, string } from 'joi';
import { $language, User } from '../../db/entities/user';
import { getUser } from '../utils/get-user';
import { authGuard } from '../guards/auth-guard';
import { USER_BIO_MAX_LENGTH, USER_NAME_MAX_LENGTH } from '@id6/commons/build/constants';

const validators = [
  body(object({
    name: string().required().max(USER_NAME_MAX_LENGTH),
    bio: string().optional().empty('').empty(null)
      .max(USER_BIO_MAX_LENGTH),
    language: $language,
  })),
];

async function handler(req: Request, res: Response): Promise<void> {
  const { name, bio, language } = req.body;
  const user = getUser(req);

  await User.update(user.id, {
    name,
    bio,
    language,
  });

  res.status(204).send();
}

export const updateProfile = [
  authGuard,
  ...validators,
  wrapAsyncMiddleware(handler),
];
