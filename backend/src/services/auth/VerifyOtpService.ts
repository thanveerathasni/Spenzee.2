import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AUTH_OTP_CONFIG } from "../../shared/constants/auth";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { VerifyOtpDto } from "../../dtos/auth/VerifyOtp.dto";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class VerifyOtpService implements IVerifyOtpService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.PendingRegistrationRepository)
    private readonly _pendingRegistrationRepository: IPendingRegistrationRepository,

    @inject(TYPES.OtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TYPES.OtpService)
    private readonly _otpService: IOtpService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: VerifyOtpDto): Promise<void> {
    const email = data.email.trim().toLowerCase();

    const pendingRegistration =
      await this._pendingRegistrationRepository.findByEmail(email);

    if (!pendingRegistration) {
      this.logFailure(
        email,
        "pending registration not found",
      );

      throw new AppError(
        AUTH_MESSAGES.INVALID_OTP,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (pendingRegistration.expiresAt.getTime() <= Date.now()) {
      await this.deleteTemporaryRegistration(email);

      this.logFailure(
        email,
        "pending registration expired",
      );

      throw new AppError(
        AUTH_MESSAGES.REGISTRATION_EXPIRED,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const storedOtp =
      await this._otpRepository.findByEmail(email);

    if (!storedOtp) {
      this.logFailure(email, "OTP not found");

      throw new AppError(
        AUTH_MESSAGES.INVALID_OTP,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (storedOtp.expiresAt.getTime() <= Date.now()) {
      await this._otpRepository.deleteByEmail(email);

      this.logFailure(email, "OTP expired");

      throw new AppError(
        AUTH_MESSAGES.OTP_EXPIRED,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      storedOtp.attempts >=
      AUTH_OTP_CONFIG.MAX_ATTEMPTS
    ) {
      await this._otpRepository.deleteByEmail(email);

      this.logFailure(
        email,
        "maximum OTP attempts exceeded",
      );

      throw new AppError(
        AUTH_MESSAGES.INVALID_OTP,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const isValid = await this._otpService.compareOtp(
      data.otp,
      storedOtp.code,
    );

    if (!isValid) {
      const updatedOtp =
        await this._otpRepository.incrementAttempts(email);

      if (
        updatedOtp &&
        updatedOtp.attempts >= AUTH_OTP_CONFIG.MAX_ATTEMPTS
      ) {
        await this._otpRepository.deleteByEmail(email);
      }

      this.logFailure(email, "OTP does not match");

      throw new AppError(
        AUTH_MESSAGES.INVALID_OTP,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const existingUser =
      await this._userRepository.findByEmail(email);

    if (existingUser) {
      await this.deleteTemporaryRegistration(email);

      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    }

    try {
      await this._userRepository.create({
        firstName: pendingRegistration.firstName,
        lastName: pendingRegistration.lastName,
        email,
        password: pendingRegistration.password,
      });
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        await this.deleteTemporaryRegistration(email);

        throw new AppError(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT,
        );
      }

      throw error;
    }

    await this.deleteTemporaryRegistration(email);

    this._logger.info(LOG_MESSAGES.OTP_VERIFIED, {
      email,
    });
  }

  private async deleteTemporaryRegistration(
    email: string,
  ): Promise<void> {
    const cleanupResults = await Promise.allSettled([
      this._otpRepository.deleteByEmail(email),
      this._pendingRegistrationRepository.deleteByEmail(email),
    ]);

    const cleanupFailed = cleanupResults.some(
      (result) => result.status === "rejected",
    );

    if (cleanupFailed) {
      this._logger.error(
        "Failed to clean up temporary registration data.",
        {
          email,
          cleanupResults,
        },
      );
    }
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    );
  }

  private logFailure(
    email: string,
    reason: string,
  ): void {
    this._logger.warn(
      LOG_MESSAGES.OTP_VERIFICATION_FAILED,
      {
        email,
        reason,
      },
    );
  }
}