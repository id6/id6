import { Request, Response } from 'express';
import { removeAuthCookie } from '../cookie';

export function handler(req: Request, res: Response) {
  removeAuthCookie(res);
  res.status(204).send();
}

export const signOut = [
  handler,
];
