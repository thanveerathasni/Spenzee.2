import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { ILogger } from "../../shared/logger/ILogger";
@injectable()
export class EmailService implements IEmailService {
  constructor(
    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async sendOtp(email: string, otp: string): Promise<void> {
    this.logger.info("Sending OTP email.", { email });
  }

  async sendPasswordResetEmail(email: string, _resetToken: string): Promise<void> {
    this.logger.info("Sending password reset email.", { email });
  }
}
