import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../../db/entities/user';
import { Logger } from '../../commons/logger/logger';
import { env } from '../../env/env';
import { JwtTokenPayload } from '../middlewares/authenticate';
import { ErrorCode } from '@id6/commons/build/error-code';

const verify = promisify(jwt.verify);

const logger = new Logger('id6.api:verifyToken');

export async function verifyToken(token: string): Promise<{
  user?: User;
  error?: { message: string, code: ErrorCode };
}> {
  let payload: JwtTokenPayload;
  try {
    payload = await verify(token, env.ID6_JWT_SECRET);
  } catch (e) {
    logger.debug('Error trying to verify token', e);
    return {
      error: {
        message: 'Invalid token',
        code: ErrorCode.invalid_token,
      },
    };
  }

  if (payload.issuedAt + env.ID6_JWT_TOKEN_EXPIRATION < Date.now()) {
    return {
      error: {
        message: 'Token expired',
        code: ErrorCode.token_expired,
      },
    };
  }

  const user = await User.findOne(payload.userId, { loadRelationIds: true });

  if (!user) {
    return {
      error: {
        message: 'User not found',
        code: ErrorCode.user_not_found,
      },
    };
  }

  if (user.invalidateTokensAt && user.invalidateTokensAt.getTime() > payload.issuedAt) {
    return {
      user,
      error: {
        message: 'Token was revoked',
        code: ErrorCode.token_revoked,
      },
    };
  }

  return { user };
}
