import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IProviderForgotPasswordController } from "../../interfaces/controllers/provider/IProviderForgotPasswordController";
import type { IProviderForgotPasswordService } from "../../interfaces/services/provider/IProviderForgotPasswordService";
import type { Request, Response } from "express";

@injectable()
export class ProviderForgotPasswordController
  implements IProviderForgotPasswordController
{
  constructor(
    @inject(TYPES.ProviderForgotPasswordService)
    private readonly _providerForgotPasswordService: IProviderForgotPasswordService,
  ) {}

  forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await this._providerForgotPasswordService.execute(req.body);

      successResponse(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
      );
    },
  );
}
