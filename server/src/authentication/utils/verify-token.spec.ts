import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { verifyToken } from './verify-token';
import { User } from '../../db/entities/user';
import { env } from '../../env/env';

const sign = promisify(jwt.sign);

jest.mock('../../env/env', () => ({
  env: {
    ID6_JWT_SECRET: 'secret',
    ID6_JWT_TOKEN_EXPIRATION: 86400 * 30 * 1000,
  },
}));

describe('verifyToken', () => {

  it('should verifies the token with jwt', async () => {
    const invalidToken = await sign({
      userId: 'hackerId',
      issuedAt: new Date('2021-01-02T00:00:00.000Z').getTime(),
    }, 'wrongSecret');

    const result = await verifyToken(invalidToken);

    expect(result).toEqual({
      error: {
        code: "invalid_token",
        message: "Invalid token",
      },
    });
  });

  it('should check that the user is in database', async () => {
    const token = await sign({
      userId: 'deletedUserId',
      issuedAt: new Date().getTime(),
    }, env.ID6_JWT_SECRET);
    const findOne = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(undefined));

    const result = await verifyToken(token);

    expect(result).toEqual({
      error: {
        code: "user_not_found",
        message: "User not found",
      },
    });
    expect(findOne).toHaveBeenCalledWith('deletedUserId', { loadRelationIds: true });
  });


  it('should check if the token is not invalidated', async () => {
    const token = await sign({
      userId: 'authenticatedUserId',
      issuedAt: new Date().getTime() - 1000,
    }, env.ID6_JWT_SECRET);
    const user = <Partial<User>>{
      invalidateTokensAt: new Date(Date.now()),
    };
    const findOne = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve<any>(user));

    const result = await verifyToken(token);

    expect(result).toEqual({
      user,
      error: {
        code: "token_revoked",
        message: "Token was revoked",
      },
    });
    expect(findOne).toHaveBeenCalledWith('authenticatedUserId', { loadRelationIds: true });
  });

  it('should return error when token expired', async () => {
    const token = await sign({
      userId: 'authenticatedUserId',
      issuedAt: new Date().getTime() - env.ID6_JWT_TOKEN_EXPIRATION - 1000,
    }, env.ID6_JWT_SECRET);
    const user = { id: 1 } as Partial<User>;
    jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve<any>(user));

    const result = await verifyToken(token);

    expect(result).toEqual({ error: { message: 'Token expired', code: 'token_expired' } });
  });

  it('should return user when token is valid', async () => {
    const token = await sign({
      userId: 'authenticatedUserId',
      issuedAt: new Date().getTime(),
    }, env.ID6_JWT_SECRET);
    const user = { id: 1 } as Partial<User>;
    jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve<any>(user));

    const result = await verifyToken(token);

    expect(result).toEqual({ user });
  });

});
