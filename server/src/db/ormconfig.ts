import { ConnectionOptions } from 'typeorm';
import { env } from '../env/env';
import { join } from 'path';
import { User } from './entities/user';
import { InitDatabase1621696186712 } from './migrations/1621696186712-InitDatabase';

export = <ConnectionOptions>{
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
  migrations: [
    InitDatabase1621696186712,
  ],
  logging: env.DEBUG.includes('id6.db') || process.env.NODE_ENV === 'development',
  // synchronize: process.env.NODE_ENV === 'development',
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};
