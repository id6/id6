import passport from 'passport';
import { StrategyType } from '@id6/commons/build/strategy-type';
import { env } from '../../../env/env';
import { Logger } from '../../../commons/logger/logger';
import { IncomingMessage } from 'http';
import { Gitlab } from './api/gitlab';
import { createOrUpdateUser } from '../../create-or-update-user';
import OAuth2Strategy from 'passport-oauth2';
import { strategies } from '../strategies';

const logger = new Logger('id6.api.passport:gitlab');

export const gitlab_redirect = '/auth/gitlab';
export const gitlab_callback = '/auth/gitlab/callback';

if (env.ID6_GITLAB_CLIENT_ID && env.ID6_GITLAB_CLIENT_SECRET) {
  passport.use(StrategyType.gitlab, new OAuth2Strategy(
    {
      authorizationURL: `${env.ID6_GITLAB_URL}/oauth/authorize`,
      tokenURL: `${env.ID6_GITLAB_URL}/oauth/token`,
      clientID: env.ID6_GITLAB_CLIENT_ID,
      clientSecret: env.ID6_GITLAB_CLIENT_SECRET,
      callbackURL: `${env.ID6_URL}${gitlab_callback}`,
      scope: 'read_api',
      passReqToCallback: true,
    },
    (req: IncomingMessage, accessToken, refreshToken, params, profile, cb) => {
      const gitlab = new Gitlab(accessToken, env.ID6_GITLAB_URL);
      gitlab
        .getUser()
        .then(gitlabUser => {
          if (!env.ID6_GITLAB_GROUPS || gitlabUser.orgs.some(org => env.ID6_GITLAB_GROUPS.includes(org))) {
            return createOrUpdateUser({
              authProvider: StrategyType.gitlab,
              externalUserId: gitlabUser.id,
              name: gitlabUser.name,
              email: gitlabUser.email,
            });
          }
          logger.warn(`User ${gitlabUser.name} tried to login but is not a member of restricted groups`);
          return undefined;
        })
        .then(user => cb(undefined, user))
        .catch(cb);
    },
  ));
  strategies.add(StrategyType.gitlab);
}

export const authenticate = passport.authenticate(StrategyType.gitlab, { session: false });
