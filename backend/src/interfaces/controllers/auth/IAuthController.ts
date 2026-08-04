import type { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
  verifyOtp: RequestHandler;
  login: RequestHandler;
  refreshToken: RequestHandler;
  logout: RequestHandler;
}
