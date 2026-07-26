import type { RequestHandler } from "express";

export interface IAuthController {
    register: RequestHandler;
    verifyOtp: RequestHandler;
}