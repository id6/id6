import { Request, Response } from 'express';
import { strategies } from '../passport/strategies';

export function getAuthMethods(req: Request, res: Response) {
  res.json(Array.from(strategies.values()));
}
