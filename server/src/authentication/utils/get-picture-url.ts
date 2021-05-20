import { createHash } from 'crypto';

export function getPictureUrl(picture: string) {
  if (!picture) {
    return undefined;
  }
  const hash = createHash('md5')
    .update(picture)
    .digest('hex');
  return `/api/user/picture?v=${hash}`;
}
