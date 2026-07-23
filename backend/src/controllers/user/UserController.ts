import { Response, Request, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../container/types";
import { IUserController, UserParams } from "../../interfaces/controllers/user/IUserController";
import { IUserService } from "../../interfaces/services/user/IUserService";
// import { SUCCESS_MESSAGES } from "../../constants/messages";
@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService)
    private readonly userService: IUserService,
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request<UserParams>, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
