import type { RequestHandler } from "express";

export interface IAdminController {
  login: RequestHandler;
  getPendingProviders: RequestHandler;
  approveProvider: RequestHandler;
  rejectProvider: RequestHandler;
}
