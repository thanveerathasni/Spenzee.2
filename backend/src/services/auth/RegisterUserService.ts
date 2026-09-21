import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { RegisterUserDto } from "../../dtos/auth/RegisterUser.dto";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class RegisterUserService implements IRegisterUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.PendingRegistrationRepository)
    private readonly _pendingRegistrationRepository: IPendingRegistrationRepository,

    @inject(TYPES.OtpRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.OtpService)
    private readonly _otpService: IOtpService,

    @inject(TYPES.EmailService)
    private readonly _emailService: IEmailService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: RegisterUserDto): Promise<void> {
    const email = data.email.trim().toLowerCase();

    const existingUser = await this._userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    }

    const [
      hashedPassword,
      pendingRegistration,
      existingOtp,
    ] = await Promise.all([
      this._passwordService.hash(data.password),
      this._pendingRegistrationRepository.findByEmail(email),
      this._otpRepository.findByEmail(email),
    ]);

    const otp = this._otpService.generateOtp();
    const hashedOtp = await this._otpService.hashOtp(otp);

    const pendingRegistrationExpiresAt =
      this._otpService.getExpiryTime(10);

    const otpExpiresAt = this._otpService.getExpiryTime();

    try {
      if (pendingRegistration) {
        await this._pendingRegistrationRepository.updateByEmail(
          email,
          {
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
            expiresAt: pendingRegistrationExpiresAt,
          },
        );
      } else {
        await this._pendingRegistrationRepository.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email,
          password: hashedPassword,
          expiresAt: pendingRegistrationExpiresAt,
        });
      }
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          HTTP_STATUS.CONFLICT,
        );
      }

      throw error;
    }

    this._logger.info(LOG_MESSAGES.OTP_GENERATED, { email });

    if (existingOtp) {
      await this._otpRepository.updateByEmail(email, {
        code: hashedOtp,
        expiresAt: otpExpiresAt,
        attempts: 0,
      });
    } else {
      try {
        await this._otpRepository.create({
          email,
          code: hashedOtp,
          expiresAt: otpExpiresAt,
        });
      } catch (error) {
        if (this.isDuplicateKeyError(error)) {
          await this._otpRepository.updateByEmail(email, {
            code: hashedOtp,
            expiresAt: otpExpiresAt,
            attempts: 0,
          });
        } else {
          throw error;
        }
      }
    }

    await this._emailService.sendOtp(email, otp);

    this._logger.info(LOG_MESSAGES.OTP_SENT, { email });
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    );
  }
}