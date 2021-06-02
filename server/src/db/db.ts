import { Logger } from '../commons/logger/logger';
import { createConnection } from 'typeorm';
import connectionOptions from './ormconfig';
import { env } from '../env/env';

const logger = new Logger('id6.initPostgres');

export async function initDb() {
  const connection = await createConnection(connectionOptions);

  if (env.ID6_MIGRATE_ROLLBACK) {
    logger.info('Rolling back migrations');
    await connection.undoLastMigration();
    await process.exit(0);
  }

  await connection.runMigrations();

  logger.info('Db initialized, migrations run');
}
