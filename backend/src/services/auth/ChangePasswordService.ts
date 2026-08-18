import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ChangePasswordDto } from "../../dtos/auth/ChangePassword.dto";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IChangePasswordService } from "../../interfaces/services/auth/IChangePasswordService";
import type { DecodedTokenPayload } from "../../interfaces/services/auth/IJwtService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class ChangePasswordService implements IChangePasswordService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: ChangePasswordDto, authenticatedUser: DecodedTokenPayload): Promise<void> {
    const user = await this._userRepository.findLoginUserByEmail(authenticatedUser.email);
    const userId = user?._id;

    if (
      !user ||
      !userId ||
      userId?.toString() !== authenticatedUser.userId ||
      user.deletedAt ||
      !user.isActive ||
      !user.password
    ) {
      this._logger.warn(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "user is not eligible for password change",
      });
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const currentPasswordMatches = await this._passwordService.compare(
      data.currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      this._logger.warn(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "current password does not match",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
    }

    const hashedPassword = await this._passwordService.hash(data.newPassword);
    const updatedUser = await this._userRepository.updateById(userId.toString(), {
      password: hashedPassword,
    });

    if (!updatedUser) {
      this._logger.error(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "user password update failed",
      });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    this._logger.info(LOG_MESSAGES.PASSWORD_CHANGED, {
      userId: authenticatedUser.userId,
    });
  }
}
