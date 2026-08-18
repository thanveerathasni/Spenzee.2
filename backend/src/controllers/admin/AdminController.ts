import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages/successMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { successResponse } from "../../shared/responses/successResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAdminLoginService } from "../../interfaces/services/admin/IAdminLoginService";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { Request, Response } from "express";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminLoginService)
    private readonly _adminLoginService: IAdminLoginService,

    @inject(TYPES.AdminProviderService)
    private readonly _adminProviderService: IAdminProviderService,
  ) {}

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginResponse = await this._adminLoginService.execute(req.body);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, loginResponse);
  });

  getPendingProviders = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const providers = await this._adminProviderService.getPendingProviders();

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.DATA_FETCHED, providers);
  });

  approveProvider = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._adminProviderService.approveProvider(req.params.id as string);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROVIDER_APPROVED);
  });

  rejectProvider = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._adminProviderService.rejectProvider(req.params.id as string);

    successResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PROVIDER_REJECTED);
  });
}
