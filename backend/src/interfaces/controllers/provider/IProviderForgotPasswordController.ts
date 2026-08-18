import type { RequestHandler } from "express";

export interface IProviderForgotPasswordController {
  forgotPassword: RequestHandler;
}
