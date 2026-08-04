import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type { ChangePasswordDto } from "../../dtos/auth/ChangePassword.dto";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IChangePasswordService } from "../../interfaces/services/auth/IChangePasswordService";
import type { DecodedTokenPayload } from "../../interfaces/services/auth/IJwtService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class ChangePasswordService implements IChangePasswordService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.PasswordService)
    private readonly passwordService: IPasswordService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: ChangePasswordDto, authenticatedUser: DecodedTokenPayload): Promise<void> {
    const user = await this.userRepository.findLoginUserByEmail(authenticatedUser.email);
    const userId = user?._id;

    if (
      !user ||
      !userId ||
      userId.toString() !== authenticatedUser.userId ||
      user.deletedAt ||
      !user.isActive ||
      !user.password
    ) {
      this.logger.warn(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "user is not eligible for password change",
      });
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    const currentPasswordMatches = await this.passwordService.compare(
      data.currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      this.logger.warn(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "current password does not match",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_CURRENT_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
    }

    const hashedPassword = await this.passwordService.hash(data.newPassword);
    const updatedUser = await this.userRepository.updateById(userId.toString(), {
      password: hashedPassword,
    });

    if (!updatedUser) {
      this.logger.error(LOG_MESSAGES.PASSWORD_CHANGE_FAILED, {
        userId: authenticatedUser.userId,
        reason: "user password update failed",
      });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    this.logger.info(LOG_MESSAGES.PASSWORD_CHANGED, {
      userId: authenticatedUser.userId,
    });
  }
}
