import type { RequestHandler } from "express";

export interface IProviderPasswordSetupController {
  setupPassword: RequestHandler;
}
