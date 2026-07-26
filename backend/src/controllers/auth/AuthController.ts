import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import { TYPES } from "../../container/types";
import { HTTP_STATUS } from "../../shared/constants/httpStatus";
import { asyncHandler } from "../../shared/utils/asyncHandler";

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

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: "OTP sent successfully.",
        });
    });

 verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.verifyOtpService.execute(req.body);

    res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "OTP verified successfully. User registered.",
    });
});
}