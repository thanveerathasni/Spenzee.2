import type { RequestHandler } from "express";

export interface IAuthMiddleware {
  authenticate: RequestHandler;
}
