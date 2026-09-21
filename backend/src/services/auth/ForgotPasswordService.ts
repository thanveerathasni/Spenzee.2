import { randomBytes } from "node:crypto";

import { inject, injectable } from "inversify";

import { env } from "../../config/env";
import { TYPES } from "../../container/types";
import { AUTH_TOKEN_EXPIRY } from "../../shared/constants/auth";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ForgotPasswordDto } from "../../dtos/auth/ForgotPassword.dto";
import type { IResetPasswordTokenRepository } from "../../interfaces/repositories/auth/IResetPasswordTokenRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IForgotPasswordService } from "../../interfaces/services/auth/IForgotPasswordService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.ResetPasswordTokenRepository)
    private readonly _resetPasswordTokenRepository: IResetPasswordTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.EmailService)
    private readonly _emailService: IEmailService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: ForgotPasswordDto): Promise<void> {
    try {
      const user = await this._userRepository.findByEmail(data.email);

      if (!user || user.deletedAt || !user.isActive) {
        this._logger.info(LOG_MESSAGES.PASSWORD_RESET_REQUESTED, {
          email: data.email,
          accountFound: false,
        });

        return;
      }

      const resetToken = randomBytes(32).toString("hex");

      const hashedResetToken = await this._passwordService.hash(resetToken);

      const expiresAt = new Date(
        Date.now() +
          AUTH_TOKEN_EXPIRY.RESET_PASSWORD_MINUTES * 60 * 1000,
      );


      await this._resetPasswordTokenRepository.upsertByEmail(
        user.email,
        hashedResetToken,
        expiresAt,
      );

      const resetUrl =
        `${env.FRONTEND_URL}/reset-password` +
        `?email=${encodeURIComponent(user.email)}` +
        `&token=${encodeURIComponent(resetToken)}`;

      await this._emailService.sendPasswordResetEmail(
        user.email,
        resetUrl,
      );

      this._logger.info(LOG_MESSAGES.PASSWORD_RESET_REQUESTED, {
        email: user.email,
        accountFound: true,
      });
    } catch (error) {
      this._logger.error(LOG_MESSAGES.PASSWORD_RESET_FAILED, {
        email: data.email,
        error,
      });

      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}