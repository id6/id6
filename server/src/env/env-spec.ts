/* eslint-disable max-len */
import { array, boolean, number, object, string } from 'joi';
import { join } from 'path';
import { Env } from './env';
import { EnvSpec } from './parse-env';
import { transform } from './transformers';
import { isUrl } from './validators/is-url';
import { URL } from 'url';

export const envSpec: EnvSpec<Env> = {
  DEBUG: string().optional()
    .description('Enable debug logs. We use the [debug](https://www.npmjs.com/package/debug) Npm package with scope `id6*`. To enable logs, use `DEBUG=id6*`. The scope for database logs is `id6.db`'),
  ID6_NAME: string().optional().default('app')
    .description('Name of your app'),
  ID6_LOGO: string().optional()
    .description('URL of your app logo'),
  ID6_TERMS_URL: string().optional()
    .description('URL of your terms of service'),
  ID6_PORT: number().integer().default(3001)
    .description('The port on which id6 is listening.'),
  ID6_URL: string().required().custom(isUrl)
    .description('URL of your id6 instance'),
  ID6_REDIRECT_URL: string().required().custom(isUrl)
    .description('URL to which your users should be redirected after login'),
  ID6_AUTHORIZATION_PORT: number().integer().optional().default(3030)
    .description('Port on which the authorization server is listening. This can be useful when your '),
  ID6_JWT_SECRET: string().required()
    .description('Secret used to sign and verify JWT tokens. Can be generated with `openssl rand -hex 32`.'),
  ID6_JWT_TOKEN_EXPIRATION: number().integer().min(3600).default(86400 * 30 * 1000)
    .description('Expiration time (in ms) for JWT tokens.'),
  ID6_TOKEN_EXPIRATION: number().integer().min(3600).default(86400 * 30 * 1000)
    .description('Expiration time (in ms) for regular tokens (password reset...).'),
  ID6_GITLAB_URL: string().default('https://gitlab.com')
    .description('Your Gitlab URL.'),
  ID6_GITLAB_CLIENT_ID: string()
    .description('Your Gitlab app Client ID.'),
  ID6_GITLAB_CLIENT_SECRET: string()
    .description('Your Gitlab app Client Secret.'),
  ID6_GITLAB_GROUPS: transform(val => val.split(','), array().optional().min(0).items(
    string().trim().required(),
  ))
    .description('Comma-separated list of Gitlab groups. Allows you to restrict login to only members of the given groups.'),
  ID6_GITEA_URL: string().default('https://gitea.com')
    .description('Your Gitea URL.'),
  ID6_GITEA_CLIENT_ID: string()
    .description('Your Gitea app Client ID.'),
  ID6_GITEA_CLIENT_SECRET: string()
    .description('Your Gitea app Client Secret.'),
  ID6_GITEA_ORGS: transform(val => val.split(','), array().optional().min(0).items(
    string().trim().required(),
  ))
    .description('Comma-separated list of Gitea organizations. Allows you to restrict login to only members of the given organizations.'),
  ID6_GITHUB_URL: string().default('https://github.com')
    .description('Your Github URL.'),
  ID6_GITHUB_CLIENT_ID: string()
    .description('Your Github app Client ID.'),
  ID6_GITHUB_CLIENT_SECRET: string()
    .description('Your Github app Client Secret.'),
  ID6_GITHUB_ORGS: transform(val => val.split(','), array().optional().min(0).items(
    string().trim().required(),
  ))
    .description('Comma-separated list of Github organizations. Allows you to restrict login to only members of the given organizations.'),
  ID6_GOOGLE_CLIENT_ID: string().optional()
    .description('Your Google app Client ID.'),
  ID6_GOOGLE_CLIENT_SECRET: string().optional()
    .description('Your Google app Client Secret.'),
  ID6_COOKIE_SAMESITE: string().default(null)
    .description('Allows you to set the [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) property for cookies defined by the server. Useful when your id6 server has a different host or URL than your UI.'),
  ID6_COOKIE_SECURE: boolean().default(false)
    .description('Allows you to set the [Secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) property for cookies defined by the server. Some browsers, like Chrome, require it to be `true` to use cookies for cross site requests (which implies you need a secure backend).'),
  ID6_RATE_LIMIT_WINDOW: number().integer().default(60 * 1000)
    .description('Applies to the authentication server only. Window size for rate limiting, in ms.'),
  ID6_RATE_LIMIT_MAX_PER_WINDOW: number().integer().default(100)
    .description('Applies to the authentication server only. Max number of requests allows in the rate limiting window.'),
  ID6_AUTHORIZATION_RATE_LIMIT_WINDOW: number().integer().default(60 * 1000)
    .description('Applies to the authorization server only. Window size for rate limiting, in ms.'),
  ID6_AUTHORIZATION_RATE_LIMIT_MAX_PER_WINDOW: number().integer().default(100)
    .description('Applies to the authorization server only. Max number of requests allows in the rate limiting window.'),
  ID6_PROMETHEUS_ENABLED: boolean().optional().default(false)
    .description('Whether to start the prometheus server.'),
  ID6_PROMETHEUS_HOST: string().optional().default('localhost')
    .description('Prometheus host.'),
  ID6_PROMETHEUS_PORT: number().integer().min(0).default(9090)
    .description('Prometheus port.'),
  ID6_PROMETHEUS_REFRESH_RATE: number().integer().min(10000).default(10000)
    .description('How often prometheus metrics shouls be refreshed.'),
  ID6_PROMETHEUS_METRICS_PREFIX: string().default('id6_')
    .description('Prometheus metric prefix.'),
  ID6_MAIL_HOST: string().optional()
    .description('Mail host.'),
  ID6_MAIL_PORT: number().integer().optional()
    .description('Mail port.'),
  ID6_MAIL_USERNAME: string().optional()
    .description('Mail username.'),
  ID6_MAIL_PASSWORD: string().optional()
    .description('Mail password.'),
  ID6_MAIL_FROM: string().optional().default(`noreply@${new URL(process.env.ID6_URL).host}`)
    .description('Mail form. Some mail providers (like OVH) force this email to equal the mail username.'),
  ID6_MAIL_SUBJECT_PREFIX: string().optional().default('id6 |')
    .description('Prefix of email subjects.'),
  ID6_MAIL_TEMPLATE_DIR: string().optional().default(join(__dirname, './emails/templates'))
    .description('Directory where mail templates can be found.'),
  ID6_USERS: transform(val => val.split(','), array().optional().items(
    object({
      user: string().required(),
      password: string().required(),
    }),
  ))
    .description('Comma-separated list of user/password for in-memory authentication. Example: "user:password,user2:password2".'),
  ID6_AUTHORIZATION_SECRET: string().required()
    .description('Secret for making requests to the authorization API.'),
  ID6_POSTGRES_URL: string().optional()
    .description('Postgres URL if you are using a postgres database.'),
  ID6_DATA_DIR: string().optional().default(join(process.cwd(), 'data'))
    .description('Path of the directory where we store data.'),
};
