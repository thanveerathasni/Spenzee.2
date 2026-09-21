import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IProviderPasswordSetupController } from "../../interfaces/controllers/provider/IProviderPasswordSetupController";
import type { IProviderPasswordSetupService } from "../../interfaces/services/provider/IProviderPasswordSetupService";
import type { Request, Response } from "express";

@injectable()
export class ProviderPasswordSetupController
  implements IProviderPasswordSetupController
{
  constructor(
    @inject(TYPES.ProviderPasswordSetupService)
    private readonly _passwordSetupService: IProviderPasswordSetupService,
  ) {}

  setupPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { providerId, token, password } = req.body;

    await this._passwordSetupService.execute(
      providerId,
      token,
      password,
    );

    successResponse(
      res,
      HTTP_STATUS.OK,
SUCCESS_MESSAGES.PROVIDER_PASSWORD_SETUP_SUCCESS,    );
  });
}
