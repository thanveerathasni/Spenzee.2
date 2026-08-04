import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";
import type { IRefreshTokenService } from "../../interfaces/services/auth/IRefreshTokenService";
import type { ILogoutService } from "../../interfaces/services/auth/ILogoutService";
import type { IForgotPasswordService } from "../../interfaces/services/auth/IForgotPasswordService";
import type { IResetPasswordService } from "../../interfaces/services/auth/IResetPasswordService";
import type { IChangePasswordService } from "../../interfaces/services/auth/IChangePasswordService";
import { TYPES } from "../../container/types";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
import { successResponse } from "../../shared/responses/successResponse";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.RegisterUserService)
    private readonly registerUserService: IRegisterUserService,

    @inject(TYPES.VerifyOtpService)
    private readonly verifyOtpService: IVerifyOtpService,

    @inject(TYPES.LoginService)
    private readonly loginService: ILoginService,

    @inject(TYPES.RefreshTokenService)
    private readonly refreshTokenService: IRefreshTokenService,

    @inject(TYPES.LogoutService)
    private readonly logoutService: ILogoutService,

    @inject(TYPES.ForgotPasswordService)
    private readonly forgotPasswordService: IForgotPasswordService,

    @inject(TYPES.ResetPasswordService)
    private readonly resetPasswordService: IResetPasswordService,

    @inject(TYPES.ChangePasswordService)
    private readonly changePasswordService: IChangePasswordService,
  ) {}

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.registerUserService.execute(req.body);

    successResponse(res, HTTP_STATUS.CREATED, AUTH_MESSAGES.OTP_SENT);
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.verifyOtpService.execute(req.body);

    successResponse(res, HTTP_STATUS.CREATED, AUTH_MESSAGES.OTP_VERIFIED);
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginResponse = await this.loginService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, loginResponse);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshTokenResponse = await this.refreshTokenService.execute(req.body);

    successResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      refreshTokenResponse,
    );
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.logoutService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.forgotPasswordService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, AUTH_MESSAGES.PASSWORD_RESET_REQUEST_ACCEPTED);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.resetPasswordService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.changePasswordService.execute(req.body, req.user!);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_CHANGED_SUCCESS);
  });
}
