import { randomBytes, scrypt } from 'crypto';

export const scryptOptions = {
  saltLength: 16,
  keyLength: 64,
  N: 16384,
  r: 8,
  p: 1,
};

function getHash(plain: string, salt: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    scrypt(plain, salt, scryptOptions.keyLength, {
      N: scryptOptions.N,
      r: scryptOptions.r,
      p: scryptOptions.p,
    }, (err, key) => {
      if (err) {
        reject(err);
      }
      resolve(key.toString('hex'));
    });
  });
}

/**
 * Returns a hashed password formatted as '<salt>:<hash>'
 * @param plain
 */
export async function hash(plain: string): Promise<string> {
  const salt = randomBytes(scryptOptions.saltLength).toString('hex');
  const passwordHash = await getHash(plain, salt);
  return `${salt}:${passwordHash}`;
}

export async function verify(plain: string, stored: string): Promise<boolean> {
  const [salt, passwordHash] = stored.split(':');
  const hex = await getHash(plain, salt);
  return hex === passwordHash;
}
