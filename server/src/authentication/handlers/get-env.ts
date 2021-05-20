import { Request, Response } from 'express';
import { env } from '../../env/env';

export function getEnv(req: Request, res: Response) {
  res.json({
    ID6_REDIRECT_URL: env.ID6_REDIRECT_URL,
    ID6_NAME: env.ID6_NAME,
    ID6_LOGO: env.ID6_LOGO,
    ID6_TERMS_URL: env.ID6_TERMS_URL,
  });
}
