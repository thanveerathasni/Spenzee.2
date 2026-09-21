import { randomInt } from "node:crypto";

import bcrypt from "bcrypt";
import { injectable } from "inversify";

import { IOtpService } from "../../interfaces/services/auth/IOtpService";
import { AUTH_OTP_CONFIG } from "../../shared/constants/auth";

@injectable()
export class OtpService implements IOtpService {
  private readonly _saltRounds = 10;

  generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  async hashOtp(otp: string): Promise<string> {
    return bcrypt.hash(otp, this._saltRounds);
  }

  async compareOtp(
    plainOtp: string,
    hashedOtp: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainOtp, hashedOtp);
  }

  getExpiryTime(
    minutes: number = AUTH_OTP_CONFIG.EXPIRY_MINUTES,
  ): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}