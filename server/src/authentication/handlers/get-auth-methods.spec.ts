import request from 'supertest';
import { createAuthenticationServer } from '../../create-authentication-server';
import { Application } from 'express';
import { Server } from 'http';
import { strategies } from '../passport/strategies';
import { StrategyType } from '@id6/commons/build/strategy-type';

describe('getAuthMethods', () => {

  let app: Application, httpServer: Server;

  beforeEach(async () => {
    ({ app, httpServer } = await createAuthenticationServer());
    strategies.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    httpServer.close();
  });

  it('should list enabled auth methods', async () => {
    strategies.add(StrategyType.gitlab);

    const response = await request(app)
      .get('/auth/methods')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(['gitlab']);
  });

});
