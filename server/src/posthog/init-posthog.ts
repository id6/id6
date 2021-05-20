import { promises } from 'fs';
import { join } from 'path';
import { env } from '../env/env';
import { v4 as uuid } from 'uuid';
import { postHogId } from './posthog';
import { sendHeartbeat } from './send-heartbeat';

async function fileExists(path: string): Promise<boolean> {
  try {
    await promises.stat(path);
  } catch (e) {
    return false;
  }
  return true;
}

const ID_PATH = join(env.ID6_DATA_DIR, 'id');

export async function initPosthog() {
  // id
  const idExists = await fileExists(ID_PATH);
  if (idExists) {
    postHogId.id = (await promises.readFile(ID_PATH)).toString();
  } else {
    postHogId.id = uuid();
    await promises.writeFile(ID_PATH, postHogId.id);
  }

  // heartbeat
  sendHeartbeat();
  setInterval(sendHeartbeat, 86400000); // every day
}
