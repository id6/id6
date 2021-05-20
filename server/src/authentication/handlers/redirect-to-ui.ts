import { Request, Response } from 'express';
import { env } from '../../env/env';
import { Logger } from '../../commons/logger/logger';

const logger = new Logger('id6.api:redirectToUi');

export function redirectToUi(req: Request, res: Response): void {
  logger.debug('Redirecting to', env.ID6_REDIRECT_URL);
  res.redirect(env.ID6_REDIRECT_URL);
}
