import type { RequestHandler } from "express";

export interface IProviderLoginController {
  login: RequestHandler;
}
