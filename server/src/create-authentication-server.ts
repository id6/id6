import { json } from 'body-parser';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import passport from 'passport';
import { Logger } from './commons/logger/logger';
import { env } from './env/env';
import routes from './authentication/routes';
import { authorize } from './authentication/middlewares/authorize';
import './authentication/passport/strategies';
import { handleError } from './commons/express/handle-error';
import { CreateServer } from './create-server';

const logger = new Logger('id6.authentication:server');

export async function createAuthenticationServer(): Promise<CreateServer> {
  const app = express();

  // middlewares
  app.use(rateLimit({
    windowMs: env.ID6_RATE_LIMIT_WINDOW,
    max: env.ID6_RATE_LIMIT_MAX_PER_WINDOW,
  }));
  app.use(morgan('tiny'));
  app.use(json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(cors({
    origin: [env.ID6_URL, env.ID6_REDIRECT_URL],
    credentials: true,
  }));

  // auth
  app.use(passport.initialize());
  app.use(authorize);

  // routes
  app.use(routes);

  // error handlers
  app.use(handleError);

  const httpServer = createServer(app);

  httpServer.listen(env.ID6_PORT, () => {
    logger.info(`Listening on port ${chalk.bold.green(env.ID6_PORT)}`);
  });

  return {
    app,
    httpServer,
  };
}
