import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";

import type { VerifyOtpDto } from "../../dtos/auth/VerifyOtp.dto";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AUTH_MESSAGES } from "../../shared/constants/messages/AuthMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class VerifyOtpService implements IVerifyOtpService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.PendingRegistrationRepository)
    private readonly pendingRegistrationRepository: IPendingRegistrationRepository,

    @inject(TYPES.OtpRepository)
    private readonly otpRepository: IOtpRepository,

    @inject(TYPES.OtpService)
    private readonly otpService: IOtpService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: VerifyOtpDto): Promise<void> {
    const { email, otp } = data;

    const pendingRegistration = await this.pendingRegistrationRepository.findByEmail(email);

    if (!pendingRegistration) {
      this.logFailure(email, "pending registration not found");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    const storedOtp = await this.otpRepository.findByEmail(email);

    if (!storedOtp) {
      this.logFailure(email, "OTP not found");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    if (storedOtp.expiresAt.getTime() < Date.now()) {
      await this.otpRepository.deleteByEmail(email);
      this.logFailure(email, "OTP expired");
      throw new AppError(AUTH_MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
    }

    const isValid = await this.otpService.compareOtp(otp, storedOtp.code);

    if (!isValid) {
      await this.otpRepository.incrementAttempts(email);
      this.logFailure(email, "OTP does not match");
      throw new AppError(AUTH_MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST);
    }

    await this.userRepository.create({
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
    });

    await this.otpRepository.deleteByEmail(email);
    await this.pendingRegistrationRepository.deleteByEmail(email);
    this.logger.info(LOG_MESSAGES.OTP_VERIFIED, { email });
  }

  private logFailure(email: string, reason: string): void {
    this.logger.warn(LOG_MESSAGES.OTP_VERIFICATION_FAILED, {
      email,
      reason,
    });
  }
}
