import { createMiddleware } from '@promster/express';
import client from 'prom-client';
import { Logger } from '../commons/logger/logger';
import { createServer } from 'http';
import { env } from '../env/env';
import { Application } from 'express';
import { userCount } from './metrics/user-count';
import chalk from 'chalk';

const logger = new Logger('id6.api:prometheus');

function updateMetrics() {
  Promise
    .all([
      userCount(),
    ])
    .catch(err => logger.error(err));
}

function registerCustomMetrics() {
  updateMetrics();
  setInterval(updateMetrics, env.ID6_PROMETHEUS_REFRESH_RATE);
}

export async function createPrometheusServer(apps: { app: Application, label: string }[]): Promise<void> {
  logger.debug('Configuring prometheus');

  apps.forEach(({ app, label }) => {
    app.use(createMiddleware({
      app: app as any,
      // https://github.com/tdeekens/promster#promstermarblejs
      options: {
        metricPrefix: `${label}`,
      },
    }));
  });

  registerCustomMetrics();

  // inspired from https://github.com/tdeekens/promster/blob/master/packages/server/modules/server/server.ts
  const server = createServer((req, res) => {
    logger.debug('Metrics fetched');
    client.register.metrics()
      .then(metrics => {
        res.writeHead(200, 'OK', {
          'content-type': client.register.contentType,
        });
        res.end(metrics);
      })
      .catch(err => {
        logger.error(err);
        res.writeHead(500, 'Internal error');
        res.end();
      });
  });

  server.listen(env.ID6_PROMETHEUS_PORT, env.ID6_PROMETHEUS_HOST, () => {
    logger.info(`listening on port ${chalk.green(env.ID6_PROMETHEUS_PORT)}`);
  });
}
