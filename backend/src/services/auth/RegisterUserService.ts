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
    const existingUser = await this._userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const [hashedPassword, pendingRegistration, existingOtp] = await Promise.all([
      this._passwordService.hash(data.password),
      this._pendingRegistrationRepository.findByEmail(data.email),
      this._otpRepository.findByEmail(data.email),
    ]);
    const otp = this._otpService.generateOtp();
    const hashedOtp = await this._otpService.hashOtp(otp);
    const expiresAt = this._otpService.getExpiryTime(10);
    const otpExpiresAt = this._otpService.getExpiryTime();

    if (pendingRegistration) {
      await this._pendingRegistrationRepository.updateByEmail(data.email, {
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        expiresAt,
      });
    } else {
      await this._pendingRegistrationRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        expiresAt,
      });
    }
    this._logger.info(otp, { email: data.email, message: LOG_MESSAGES.OTP_GENERATED });
    if (existingOtp) {
      await this._otpRepository.updateByEmail(data.email, {
        code: hashedOtp,
        expiresAt: otpExpiresAt,
      });
    } else {
      await this._otpRepository.create({
        email: data.email,
        code: hashedOtp,
        expiresAt: otpExpiresAt,
      });
    }

    await this._emailService.sendOtp(data.email, otp);
    this._logger.info(LOG_MESSAGES.OTP_SENT, { email: data.email });
  }
}
