import { Application } from 'express';
import { Server } from 'http';

export interface CreateServer {
  app: Application;
  httpServer: Server;
}
