import { type Request, type Response, type NextFunction } from "express";
import { type ParamsDictionary } from "express-serve-static-core";

export interface UserParams extends ParamsDictionary {
  id: string;
}

export interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;

  getUserById(req: Request<UserParams>, res: Response, next: NextFunction): Promise<void>;
}
