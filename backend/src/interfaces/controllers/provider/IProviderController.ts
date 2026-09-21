import type { RequestHandler } from "express";

export interface IProviderController {
  apply: RequestHandler;
}