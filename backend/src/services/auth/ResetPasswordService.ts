import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type { ResetPasswordDto } from "../../dtos/auth/ResetPassword.dto";
import type { IResetPasswordTokenRepository } from "../../interfaces/repositories/auth/IResetPasswordTokenRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IResetPasswordService } from "../../interfaces/services/auth/IResetPasswordService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class ResetPasswordService implements IResetPasswordService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.ResetPasswordTokenRepository)
    private readonly resetPasswordTokenRepository: IResetPasswordTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly passwordService: IPasswordService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const resetToken = await this.resetPasswordTokenRepository.findByEmail(data.email);

    if (!resetToken) {
      this.logInvalidResetAttempt(data.email, "reset token not found");
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      await this.resetPasswordTokenRepository.deleteByEmail(data.email);
      this.logInvalidResetAttempt(data.email, "reset token expired");
      throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const tokenMatches = await this.passwordService.compare(data.token, resetToken.token);

    if (!tokenMatches) {
      this.logInvalidResetAttempt(data.email, "reset token does not match");
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await this.userRepository.findByEmail(data.email);
    const userId = user?._id;

    if (!user || !userId || !user.isActive) {
      this.logInvalidResetAttempt(data.email, "user is not eligible for password reset");
      throw new AppError(ERROR_MESSAGES.INVALID_RESET_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const hashedPassword = await this.passwordService.hash(data.password);
    const updatedUser = await this.userRepository.updateById(userId.toString(), {
      password: hashedPassword,
    });

    if (!updatedUser) {
      this.logger.error(LOG_MESSAGES.PASSWORD_RESET_FAILED, {
        email: data.email,
        reason: "user password update failed",
      });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    await this.resetPasswordTokenRepository.deleteByEmail(data.email);
    this.logger.info(LOG_MESSAGES.PASSWORD_RESET_COMPLETED, {
      userId: userId.toString(),
    });
  }

  private logInvalidResetAttempt(email: string, reason: string): void {
    this.logger.warn(LOG_MESSAGES.PASSWORD_RESET_FAILED, { email, reason });
  }
}
