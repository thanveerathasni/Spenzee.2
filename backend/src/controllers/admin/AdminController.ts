
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAdminLoginService } from "../../interfaces/services/admin/IAdminLoginService";

import { TYPES } from "../../container/types";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { successResponse } from "../../shared/responses/successResponse";
import { AUTH_MESSAGES } from "../../constants/messages";




@injectable()
export class AdminController implements IAdminController{
constructor(

@inject (TYPES.AdminLoginService)
private readonly _adminLoginService : IAdminLoginService,


){}

login = asyncHandler(async(req:Request,res:Response):Promise<void>=>{

    const loginResponse = await this._adminLoginService.execute(req.body)

    successResponse(
        res,
        HTTP_STATUS.OK,
AUTH_MESSAGES.LOGIN_SUCCESS,
        loginResponse
    )

}

)







}
