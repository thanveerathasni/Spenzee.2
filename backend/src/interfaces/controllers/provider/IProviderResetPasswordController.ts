import type { RequestHandler } from "express";

export interface IProviderResetPasswordController {
  resetPassword: RequestHandler;
}
