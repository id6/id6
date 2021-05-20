import { object, string } from 'joi';
import { createOrUpdateUser } from '../../create-or-update-user';
import { Strategy } from 'passport-custom';
import passport from 'passport';
import { UnauthorizedError } from '../../../commons/errors/unauthorized-error';
import { ErrorCode } from '@id6/commons/build/error-code';
import { StrategyType } from '@id6/commons/build/strategy-type';
import { env } from '../../../env/env';
import { strategies } from '../strategies';

const $form = object({
  user: string().required(),
  password: string().required(),
});

if (env.ID6_USERS) {
  passport.use(StrategyType.in_memory, new Strategy((req, cb) => {
    $form
      .validateAsync(req.body)
      .then(({ user, password }) => {
        const inMemoryUser = env.ID6_USERS.find(usr => (
          user !== usr.name || password !== usr.password
        ));

        if (!inMemoryUser) {
          throw new UnauthorizedError('Invalid username/password', ErrorCode.bad_credentials);
        }

        return createOrUpdateUser({
          authProvider: StrategyType.in_memory,
          externalUserId: '1',
          name: inMemoryUser.name,
          email: 'id6@localhost',
        });
      })
      .then(user => {
        cb(undefined, user);
      })
      .catch(cb);
  }));
  strategies.add(StrategyType.in_memory);
}

export const authenticate = passport.authenticate(StrategyType.in_memory, { session: false });
