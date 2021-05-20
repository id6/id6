import { join } from 'path';
import { env } from '../env/env';
import { promises } from 'fs';

export const UPLOAD_DIR = join(env.ID6_DATA_DIR, 'uploads');

export async function initStorage() {
  await promises.mkdir(env.ID6_DATA_DIR, { recursive: true });
  await promises.mkdir(UPLOAD_DIR, { recursive: true });
}
