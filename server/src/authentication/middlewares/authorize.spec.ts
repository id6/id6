import { Express } from 'express';
import { User } from '../../db/entities/user';
import * as _verifyToken from '../utils/verify-token';
import { authorize } from './authorize';
import { Server } from "http";
import supertest from 'supertest';
import cookieParser from 'cookie-parser';
import express = require('express');

jest.mock('../../env/env', () => ({
  env: {
    ID6_AUTH_ADAPTER: undefined,
  },
}));

describe('authorizeReq', () => {

  let app: Express;
  let server: Server;

  let reqUser = undefined;

  beforeEach(async () => {
    app = express();
    app.use(cookieParser());
    app.use(authorize);
    app.use('/*', (req, res) => {
      reqUser = req.user;
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should set user in request and call next', async () => {
    const user = { _id: 'id' } as Partial<User> as User;
    const verifyToken = jest.spyOn(_verifyToken, 'verifyToken').mockReturnValue(Promise.resolve({ user }));

    const response = await supertest(app)
      .get('/')
      .set('Cookie', ['auth=token'])
      .send();

    expect(response.status).toEqual(200);
    expect(reqUser).toEqual(user);
    expect(verifyToken).toHaveBeenCalledWith('token');
  });

  it('should not set user if no token is set', async () => {
    const response = await supertest(app)
      .get('/')
      .send();

    expect(response.status).toEqual(200);
    expect(reqUser).toBeUndefined();
  });

  it('should throw if the token is invalid', async () => {
    jest.spyOn(_verifyToken, 'verifyToken')
      .mockImplementation(() => {
        return Promise.resolve({ error: { code: 'invalid_token' as any, message: 'Invalid token' } });
      });

    const response = await supertest(app)
      .get('/')
      .set('Cookie', ['auth=token'])
      .send();

    expect(response.status).not.toEqual(200);
    expect(response.headers['set-cookie'][0]).toMatch(/auth=; Max-Age=0; Path=\/; Expires=.*; HttpOnly/);
    expect(reqUser).toBeUndefined();
  });

});
