import { randomBytes } from "node:crypto";

import { inject, injectable } from "inversify";

import { env } from "../../config/env";
import { TYPES } from "../../container/types";
import { AUTH_TOKEN_EXPIRY } from "../../shared/constants/auth";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ForgotPasswordDto } from "../../dtos/auth/ForgotPassword.dto";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { IProviderForgotPasswordService } from "../../interfaces/services/provider/IProviderForgotPasswordService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class ProviderForgotPasswordService
  implements IProviderForgotPasswordService
{
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderResetPasswordTokenRepository)
    private readonly _tokenRepository: IProviderResetPasswordTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.EmailService)
    private readonly _emailService: IEmailService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: ForgotPasswordDto): Promise<void> {
    try {
      const provider = await this._providerRepository.findByEmail(data.email);

      if (provider?.status !== ProviderStatus.ACTIVE) {
        this._logger.info(LOG_MESSAGES.PASSWORD_RESET_REQUESTED, {
          email: data.email,
          accountFound: false,
        });

        return;
      }

      if (!provider._id) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );
      }

      const resetToken = randomBytes(32).toString("hex");

      const hashedToken = await this._passwordService.hash(resetToken);

      const expiresAt = new Date(
        Date.now() +
          AUTH_TOKEN_EXPIRY.RESET_PASSWORD_MINUTES * 60 * 1000,
      );

      await this._tokenRepository.upsertByProvider(
        provider._id.toString(),
        hashedToken,
        expiresAt,
      );

      const resetUrl =
        `${env.FRONTEND_URL}/provider/reset-password` +
        `?email=${encodeURIComponent(provider.email)}` +
        `&token=${encodeURIComponent(resetToken)}`;

      await this._emailService.sendPasswordResetEmail(
        provider.email,
        resetUrl,
      );

      this._logger.info(LOG_MESSAGES.PASSWORD_RESET_REQUESTED, {
        email: provider.email,
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