import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IProviderResetPasswordController } from "../../interfaces/controllers/provider/IProviderResetPasswordController";
import type { IProviderResetPasswordService } from "../../interfaces/services/provider/IProviderResetPasswordService";
import type { Request, Response } from "express";

@injectable()
export class ProviderResetPasswordController
  implements IProviderResetPasswordController
{
  constructor(
    @inject(TYPES.ProviderResetPasswordService)
    private readonly _providerResetPasswordService: IProviderResetPasswordService,
  ) {}

  resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await this._providerResetPasswordService.execute(req.body);

      successResponse(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
      );
    },
  );
}
