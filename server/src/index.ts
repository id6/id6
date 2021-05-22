/* eslint-disable @typescript-eslint/no-var-requires,no-console */

console.log(`id6 ${BUILD_INFO.version} - ${BUILD_INFO.buildDate} - ${BUILD_INFO.commitHash}`);

/*
 * Order matters
 */
require('source-map-support/register');
require('dotenv/config');
require('reflect-metadata');
const { env } = require('./env/env');

const { createAuthenticationServer } = require('./create-authentication-server');
const { createAuthorizationServer } = require('./create-authorization-server');
const { createPrometheusServer } = require('./prometheus/create-prometheus-server');
const { initDb } = require('./db/db');
const { signalIsUp } = require('@promster/express');
const { initStorage } = require('./storage/init-storage');
const { initPosthog } = require('./posthog/init-posthog');

async function main() {
  await initStorage();
  await initPosthog();
  await initDb();

  const { app: authenticationServer } = await createAuthenticationServer();
  const { app: authorizationServer } = await createAuthorizationServer();

  if (env.ID6_PROMETHEUS_ENABLED) {
    await createPrometheusServer([
      {
        app: authenticationServer,
        label: 'authentication_',
      },
      {
        app: authorizationServer,
        label: 'authorization_',
      },
    ]);
    signalIsUp();
  }
}

main().catch(console.error);
