import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AUTH_OTP_CONFIG } from "../../shared/constants/auth";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
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
    const { email, otp } = data;

    const pendingRegistration = await this._pendingRegistrationRepository.findByEmail(email);

    if (!pendingRegistration) {
      this.logFailure(email, "pending registration not found");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    const storedOtp = await this._otpRepository.findByEmail(email);

    if (!storedOtp) {
      this.logFailure(email, "OTP not found");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    if (storedOtp.expiresAt.getTime() < Date.now()) {
      await this._otpRepository.deleteByEmail(email);
      this.logFailure(email, "OTP expired");
      throw new AppError(AUTH_MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
    }

    if (storedOtp.attempts >= AUTH_OTP_CONFIG.MAX_ATTEMPTS) {
      await this._otpRepository.deleteByEmail(email);
      this.logFailure(email, "maximum OTP attempts exceeded");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    const isValid = await this._otpService.compareOtp(otp, storedOtp.code);

    if (!isValid) {
      const updatedOtp = await this._otpRepository.incrementAttempts(email);

      if (updatedOtp?.attempts !== undefined) {
        if (updatedOtp.attempts >= AUTH_OTP_CONFIG.MAX_ATTEMPTS) {
          await this._otpRepository.deleteByEmail(email);
        }
      }

      this.logFailure(email, "OTP does not match");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    await this._userRepository.create({
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
    });

    await this._otpRepository.deleteByEmail(email);
    await this._pendingRegistrationRepository.deleteByEmail(email);

    this._logger.info(LOG_MESSAGES.OTP_VERIFIED, { email });
  }

  private logFailure(email: string, reason: string): void {
    this._logger.warn(LOG_MESSAGES.OTP_VERIFICATION_FAILED, {
      email,
      reason,
    });
  }
}
