import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import { TYPES } from "../../container/types";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
import { successResponse } from "../../shared/responses/successResponse";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.RegisterUserService)
        private readonly registerUserService: IRegisterUserService,

        @inject(TYPES.VerifyOtpService)
        private readonly verifyOtpService: IVerifyOtpService,
    ) {}

    register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        await this.registerUserService.execute(req.body);

      successResponse(
            res,
            HTTP_STATUS.CREATED,
            AUTH_MESSAGES.OTP_SENT,
        );
    });

    verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        await this.verifyOtpService.execute(req.body);

      successResponse(
            res,
            HTTP_STATUS.CREATED,
            AUTH_MESSAGES.OTP_VERIFIED,
        );
    });
}