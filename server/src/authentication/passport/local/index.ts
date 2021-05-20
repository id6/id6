import passport from 'passport';
import { Strategy } from 'passport-custom';
import { object, string } from 'joi';
import { User } from '../../../db/entities/user';
import { verify } from '../../utils/password';
import { UnauthorizedError } from '../../../commons/errors/unauthorized-error';
import { ErrorCode } from '@id6/commons/build/error-code';
import { StrategyType } from '@id6/commons/build/strategy-type';
import { env } from '../../../env/env';
import { strategies } from '../strategies';

const $form = object({
  email: string().required().email(),
  password: string().required().max(255),
});

async function verifyUser(email: string, password: string): Promise<User> {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid username/password', ErrorCode.invalid_username_password);
  }

  if (!user.confirmed) {
    throw new UnauthorizedError('Email not confirmed', ErrorCode.email_not_confirmed);
  }

  const verified = await verify(password, user.password);
  if (!verified) {
    throw new UnauthorizedError('Invalid username/password', ErrorCode.invalid_username_password);
  }

  return user;
}

if (env.ID6_MAIL_HOST && env.ID6_MAIL_PORT) {
  passport.use(StrategyType.local, new Strategy((req, cb) => {
    $form
      .validateAsync(req.body)
      .then(({ email, password }) => (
        verifyUser(email, password)
      ))
      .then(user => {
        cb(undefined, user);
      })
      .catch(cb);
  }));
  strategies.add(StrategyType.local);
}

export const authenticate = passport.authenticate(StrategyType.local, { session: false });
