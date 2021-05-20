import { json } from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import { Logger } from './commons/logger/logger';
import { env } from './env/env';
import { handleError } from './commons/express/handle-error';
import { authorize } from './authorization/middlewares/authorize';
import routes from './authorization/routes';
import compression from 'compression';
import { CreateServer } from './create-server';

const logger = new Logger('id6.authorization:server');

export async function createAuthorizationServer(): Promise<CreateServer> {
  const app = express();

  // middlewares
  app.use(rateLimit({
    windowMs: env.ID6_AUTHORIZATION_RATE_LIMIT_WINDOW,
    max: env.ID6_AUTHORIZATION_RATE_LIMIT_MAX_PER_WINDOW,
  }));
  app.use(morgan('tiny'));
  app.use(compression());
  app.use(json());
  app.use(helmet());

  // auth
  app.use(authorize);

  // routes
  app.use(routes);

  // error handlers
  app.use(handleError);

  const httpServer = createServer(app);

  httpServer.listen(env.ID6_AUTHORIZATION_PORT, () => {
    logger.info(`Listening on port ${chalk.bold.green(env.ID6_AUTHORIZATION_PORT)}`);
  });

  return {
    app,
    httpServer,
  };
}
