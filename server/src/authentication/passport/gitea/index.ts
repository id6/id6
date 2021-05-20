import passport from 'passport';
import { StrategyType } from '@id6/commons/build/strategy-type';
import { env } from '../../../env/env';
import { Gitea } from './api/gitea';
import { createOrUpdateUser } from '../../create-or-update-user';
import OAuth2Strategy from 'passport-oauth2';
import { Logger } from '../../../commons/logger/logger';
import { strategies } from '../strategies';

export const gitea_redirect = '/auth/gitea';
export const gitea_callback = '/auth/gitea/callback';

const logger = new Logger('id6.api.passport:gitea');

if (
  env.ID6_GITLAB_CLIENT_ID
  && env.ID6_GITLAB_CLIENT_SECRET
) {
  passport.use(StrategyType.gitea, new OAuth2Strategy(
    {
      authorizationURL: `${env.ID6_GITEA_URL}/login/oauth/authorize`,
      tokenURL: `${env.ID6_GITEA_URL}/login/oauth/access_token`,
      clientID: env.ID6_GITLAB_CLIENT_ID,
      clientSecret: env.ID6_GITLAB_CLIENT_SECRET,
      callbackURL: `${env.ID6_URL}${gitea_callback}`,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, params, profile, cb) => {
      const gitea = new Gitea(accessToken, env.ID6_GITEA_URL);
      gitea
        .getUser()
        .then(giteaUser => {
          if (!env.ID6_GITEA_ORGS || giteaUser.orgs.some(org => env.ID6_GITEA_ORGS.includes(org))) {
            return createOrUpdateUser({
              authProvider: StrategyType.gitea,
              externalUserId: giteaUser.id,
              name: giteaUser.name,
              email: giteaUser.email,
              picture: giteaUser.picture,
              language: giteaUser.language,
            });
          }
          logger.warn(`User ${giteaUser.name} tried to login but is not a member of restricted orgs`);
          return undefined;
        })
        .then(user => cb(undefined, user))
        .catch(cb);
    },
  ));
  strategies.add(StrategyType.gitea);
}

export const authenticate = passport.authenticate(StrategyType.gitea, { session: false });
