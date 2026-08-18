import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IProviderLoginController } from "../../interfaces/controllers/provider/IProviderLoginController";
import type { IProviderLoginService } from "../../interfaces/services/provider/IProviderLoginService";
import type { Request, Response } from "express";

@injectable()
export class ProviderLoginController implements IProviderLoginController {
  constructor(
    @inject(TYPES.ProviderLoginService)
    private readonly _providerLoginService: IProviderLoginService,
  ) {}

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginResponse = await this._providerLoginService.execute(req.body);

    successResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.LOGIN_SUCCESS,
      loginResponse,
    );
  });
}
