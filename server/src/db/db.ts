import { ConnectionOptions, createConnection } from 'typeorm';
import { Logger } from '../commons/logger/logger';
import { User } from './entities/user';
import { env } from '../env/env';
import { join } from 'path';

const logger = new Logger('id6.initPostgres');

export async function initDb() {
  await createConnection(<ConnectionOptions>{
    ...(env.ID6_POSTGRES_URL ? <Partial<ConnectionOptions>>{
      type: 'postgres',
      url: env.ID6_POSTGRES_URL,
    } as any : <Partial<ConnectionOptions>>{
      type: 'sqlite',
      database: join(env.ID6_DATA_DIR, 'id6.sqlite'),
    } as any),
    entities: [
      User,
    ],
    migrate: true,
    migrations: ['./migrations'],
    logging: env.DEBUG.includes('id6.db') || process.env.NODE_ENV === 'development',
    synchronize: process.env.NODE_ENV === 'development',
  });

  logger.info('Db connection established');
}
