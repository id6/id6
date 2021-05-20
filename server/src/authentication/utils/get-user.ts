import { Request } from 'express';
import { User } from '../../db/entities/user';

export function getUser(req: Request): User {
  return req.user as User;
}
