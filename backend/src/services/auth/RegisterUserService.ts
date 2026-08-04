import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";

import type { RegisterUserDto } from "../../dtos/auth/RegisterUser.dto";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import type { ILogger } from "../../shared/logger/ILogger";
@injectable()
export class RegisterUserService implements IRegisterUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.PendingRegistrationRepository)
    private readonly pendingRegistrationRepository: IPendingRegistrationRepository,

    @inject(TYPES.OtpRepository)
    private readonly otpRepository: IOtpRepository,

    @inject(TYPES.PasswordService)
    private readonly passwordService: IPasswordService,

    @inject(TYPES.OtpService)
    private readonly otpService: IOtpService,

    @inject(TYPES.EmailService)
    private readonly emailService: IEmailService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: RegisterUserDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const [hashedPassword, pendingRegistration, existingOtp] = await Promise.all([
      this.passwordService.hash(data.password),
      this.pendingRegistrationRepository.findByEmail(data.email),
      this.otpRepository.findByEmail(data.email),
    ]);
    const otp = this.otpService.generateOtp();
    const hashedOtp = await this.otpService.hashOtp(otp);
    const expiresAt = this.otpService.getExpiryTime(10);
    const otpExpiresAt = this.otpService.getExpiryTime();

    if (pendingRegistration) {
      await this.pendingRegistrationRepository.updateByEmail(data.email, {
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        expiresAt,
      });
    } else {
      await this.pendingRegistrationRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        expiresAt,
      });
    }

    if (existingOtp) {
      await this.otpRepository.updateByEmail(data.email, {
        code: hashedOtp,
        expiresAt: otpExpiresAt,
      });
    } else {
      await this.otpRepository.create({
        email: data.email,
        code: hashedOtp,
        expiresAt: otpExpiresAt,
      });
    }

    await this.emailService.sendOtp(data.email, otp);
    this.logger.info(LOG_MESSAGES.OTP_SENT, { email: data.email });
  }
}
