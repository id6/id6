/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import { StrategyType } from '@id6/commons/build/strategy-type';
import GoogleStrategy from 'passport-google-oauth20';
import { GoogleUser } from './types/google-user';
import iso639 from 'iso-639-1';
import { env } from '../../../env/env';
import { createOrUpdateUser } from '../../create-or-update-user';
import { strategies } from '../strategies';

export const google_redirect = '/auth/google';
export const google_callback = '/auth/google/callback';

function getLanguage(profile: GoogleUser): string {
  const split = profile._json.locale?.split(/[_-]/);
  if (!split && split.length === 0) {
    return undefined;
  }
  const language = split[0];
  return !iso639.validate(language) ? undefined : language;
}

if (env.ID6_GOOGLE_CLIENT_ID && env.ID6_GOOGLE_CLIENT_SECRET) {
  passport.use(StrategyType.google, new GoogleStrategy(
    {
      clientID: env.ID6_GOOGLE_CLIENT_ID,
      clientSecret: env.ID6_GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.ID6_URL}${google_callback}`,
    },
    (accessToken, refreshToken, profile: GoogleUser, cb) => {
      createOrUpdateUser({
        authProvider: StrategyType.google,
        externalUserId: profile._json.sub,
        name: profile._json.name,
        email: profile._json.email,
        picture: profile._json.picture,
        language: getLanguage(profile),
      })
        .then(user => cb(undefined, user))
        .catch(cb);
    },
  ));
  strategies.add(StrategyType.local);
}

export const authenticate = passport.authenticate(StrategyType.google, {
  session: false,
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
});
