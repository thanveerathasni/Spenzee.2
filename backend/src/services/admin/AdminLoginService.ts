import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AuthMapper } from "../../mappers/auth/AuthMapper";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";

import type { AdminLoginResponseDto } from "../../dtos/auth/AdminLoginResponse.dto";
import type { LoginRequestDto } from "../../dtos/auth/LoginRequest.dto";
import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IAdminLoginService } from "../../interfaces/services/admin/IAdminLoginService";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";

@injectable()
export class AdminLoginService implements IAdminLoginService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(data: LoginRequestDto): Promise<AdminLoginResponseDto> {
    const admin = await this._adminRepository.findLoginAdminByEmail(data.email);

    if (!admin) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (!admin.isActive) {
      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_INACTIVE,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const passwordMatches = await this._passwordService.compare(
      data.password,
      admin.password,
    );

    if (!passwordMatches) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const adminObjectId = admin._id;

    if (!adminObjectId) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    const adminId = adminObjectId.toString();

    const payload = {
      userId: adminId,
      email: admin.email,
      role: UserRole.ADMIN,
    };

    const accessToken = this._jwtService.generateAccessToken(payload);

    const refreshToken = this._jwtService.generateRefreshToken(payload);

    await this._refreshTokenRepository.store({
      userId: adminObjectId,
      userType: "Admin",
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
    });

    await this._adminRepository.updateById(adminId, {
      lastLoginAt: new Date(),
    });

    return AuthMapper.toAdminLoginResponse(
      admin,
      accessToken,
      refreshToken.token,
    );
  }
}