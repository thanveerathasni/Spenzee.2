import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IProviderController } from "../../interfaces/controllers/provider/IProviderController";
import type { IApplyProviderService } from "../../interfaces/services/provider/IApplyProviderService";
import type { Request, Response } from "express";

@injectable()
export class ProviderController implements IProviderController {
  constructor(
    @inject(TYPES.ApplyProviderService)
    private readonly _applyProviderService: IApplyProviderService,
  ) {}

  apply = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._applyProviderService.execute(req.body);

    successResponse(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.PROVIDER_APPLICATION_SUBMITTED);
  });
}
