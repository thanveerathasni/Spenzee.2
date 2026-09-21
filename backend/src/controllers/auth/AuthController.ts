import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IChangePasswordService } from "../../interfaces/services/auth/IChangePasswordService";
import type { IForgotPasswordService } from "../../interfaces/services/auth/IForgotPasswordService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";
import type { ILogoutService } from "../../interfaces/services/auth/ILogoutService";
import type { IRefreshTokenService } from "../../interfaces/services/auth/IRefreshTokenService";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IResetPasswordService } from "../../interfaces/services/auth/IResetPasswordService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import type { Request, Response } from "express";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.RegisterUserService)
    private readonly _registerUserService: IRegisterUserService,

    @inject(TYPES.VerifyOtpService)
    private readonly _verifyOtpService: IVerifyOtpService,

    @inject(TYPES.LoginService)
    private readonly _loginService: ILoginService,

    @inject(TYPES.RefreshTokenService)
    private readonly _refreshTokenService: IRefreshTokenService,

    @inject(TYPES.LogoutService)
    private readonly _logoutService: ILogoutService,

    @inject(TYPES.ForgotPasswordService)
    private readonly _forgotPasswordService: IForgotPasswordService,

    @inject(TYPES.ResetPasswordService)
    private readonly _resetPasswordService: IResetPasswordService,

    @inject(TYPES.ChangePasswordService)
    private readonly _changePasswordService: IChangePasswordService,
  ) {}

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._registerUserService.execute(req.body);

    successResponse(res, HTTP_STATUS.CREATED, AUTH_MESSAGES.OTP_SENT);
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._verifyOtpService.execute(req.body);

    successResponse(res, HTTP_STATUS.CREATED, AUTH_MESSAGES.OTP_VERIFIED);
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginResponse = await this._loginService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, loginResponse);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshTokenResponse = await this._refreshTokenService.execute(req.body);

    successResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      refreshTokenResponse,
    );
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._logoutService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._forgotPasswordService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, AUTH_MESSAGES.PASSWORD_RESET_REQUEST_ACCEPTED);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._resetPasswordService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._changePasswordService.execute(req.body, req.user!);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PASSWORD_CHANGED_SUCCESS);
  });
}
