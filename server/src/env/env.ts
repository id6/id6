import { Logger } from '../commons/logger/logger';
import { envSpec } from './env-spec';
import { parseEnv } from './parse-env';

export interface Env {
  DEBUG: string;

  /* branding */
  ID6_NAME: string;
  ID6_LOGO: string;
  ID6_TERMS_URL: string;

  /* authentication */

  ID6_PORT: number;
  ID6_URL: string;
  ID6_REDIRECT_URL: string;

  /* authorization */

  ID6_AUTHORIZATION_SECRET: string;
  ID6_AUTHORIZATION_PORT: number;

  /* security */

  // tokens
  ID6_TOKEN_EXPIRATION: number;

  // jwt
  ID6_JWT_SECRET: string;
  ID6_JWT_TOKEN_EXPIRATION: number;

  // rate limiting
  ID6_RATE_LIMIT_WINDOW: number;
  ID6_RATE_LIMIT_MAX_PER_WINDOW: number;
  ID6_AUTHORIZATION_RATE_LIMIT_WINDOW: number;
  ID6_AUTHORIZATION_RATE_LIMIT_MAX_PER_WINDOW: number;

  // cookies
  ID6_COOKIE_SAMESITE: boolean;
  ID6_COOKIE_SECURE: boolean;

  /* external services */

  // database
  ID6_POSTGRES_URL: string;

  // typeorm
  // TYPEORM_MIGRATIONS_DIR: string;

  /* Auth */

  // gitlab
  ID6_GITLAB_URL: string;
  ID6_GITLAB_CLIENT_ID: string;
  ID6_GITLAB_CLIENT_SECRET: string;
  ID6_GITLAB_GROUPS: string[];

  // gitea
  ID6_GITEA_URL: string;
  ID6_GITEA_CLIENT_ID: string;
  ID6_GITEA_CLIENT_SECRET: string;
  ID6_GITEA_ORGS: string[];

  // github
  ID6_GITHUB_URL: string;
  ID6_GITHUB_CLIENT_ID: string;
  ID6_GITHUB_CLIENT_SECRET: string;
  ID6_GITHUB_ORGS: string[];

  // google
  ID6_GOOGLE_CLIENT_ID: string;
  ID6_GOOGLE_CLIENT_SECRET: string;

  // in memory
  ID6_USERS: { name: string; password: string }[];

  /* monitoring */

  // prometheus
  ID6_PROMETHEUS_ENABLED: string;
  ID6_PROMETHEUS_HOST: string;
  ID6_PROMETHEUS_PORT: number;
  ID6_PROMETHEUS_REFRESH_RATE: number;
  ID6_PROMETHEUS_METRICS_PREFIX: string;

  /* email */

  ID6_MAIL_HOST: string;
  ID6_MAIL_PORT: number;
  ID6_MAIL_USERNAME: number;
  ID6_MAIL_PASSWORD: number;
  ID6_MAIL_FROM: string;
  ID6_MAIL_TEMPLATE_DIR: string;
  ID6_MAIL_SUBJECT_PREFIX: string;

  /* misc */
  ID6_DATA_DIR: string;
}

export const env: Env = parseEnv(envSpec);

const logger = new Logger('id6.api:env');
logger.debug('loaded env', env);
