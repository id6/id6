import passport from 'passport';
import { StrategyType } from '@id6/commons/build/strategy-type';
import { Logger } from '../../../commons/logger/logger';
import { env } from '../../../env/env';
import { Github } from './api/github';
import { createOrUpdateUser } from '../../create-or-update-user';
import OAuth2Strategy from 'passport-oauth2';
import { strategies } from '../strategies';

const logger = new Logger('id6.api.passport:github');

export const github_redirect = '/auth/github';
export const github_callback = '/auth/github/callback';

if (env.ID6_GITHUB_CLIENT_ID && env.ID6_GITHUB_CLIENT_SECRET) {
  passport.use(StrategyType.github, new OAuth2Strategy(
    {
      authorizationURL: `${env.ID6_GITHUB_URL}/login/oauth/authorize`,
      tokenURL: `${env.ID6_GITHUB_URL}/login/oauth/access_token`,
      clientID: env.ID6_GITHUB_CLIENT_ID,
      clientSecret: env.ID6_GITHUB_CLIENT_SECRET,
      callbackURL: `${env.ID6_URL}${github_callback}`,
      scope: 'read:user,user:email,read:org',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, params, profile, cb) => {
      const github = new Github(accessToken, env.ID6_GITHUB_URL);
      github
        .getUser()
        .then(githubUser => {
          if (!env.ID6_GITHUB_ORGS || githubUser.orgs.some(org => env.ID6_GITHUB_ORGS.includes(org))) {
            return createOrUpdateUser({
              authProvider: StrategyType.github,
              externalUserId: githubUser.id,
              name: githubUser.name,
              email: githubUser.email,
              picture: githubUser.picture,
              bio: githubUser.bio,
            });
          }
          logger.warn('User tried to login but is not a member of restricted orgs', githubUser);
          return undefined;
        })
        .then(user => cb(undefined, user))
        .catch(cb);
    },
  ));
  strategies.add(StrategyType.github);
}

export const authenticate = passport.authenticate(StrategyType.github, { session: false });
