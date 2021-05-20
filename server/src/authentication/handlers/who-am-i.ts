import { Request, Response } from 'express';
import { serializeUser } from '../serialize-user';
import { getUser } from '../utils/get-user';
import { wrapAsyncMiddleware } from '../../commons/express/wrap-async-middleware';

async function handler(req: Request, res: Response) {
  const user = getUser(req);
  res.json(user ? await serializeUser(user) : null);
}

export const whoAmI = [
  wrapAsyncMiddleware(handler),
];
