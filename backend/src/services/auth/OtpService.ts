import bcrypt from "bcrypt";
import { injectable } from "inversify";

import { IOtpService } from "../../interfaces/services/auth/IOtpService";

@injectable()
export class OtpService implements IOtpService {
  private readonly _saltRounds = 10;
  private readonly _expiryMinutes = 5;

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async hashOtp(otp: string): Promise<string> {
    return bcrypt.hash(otp, this._saltRounds);
  }

  async compareOtp(plainOtp: string, hashedOtp: string): Promise<boolean> {
    return bcrypt.compare(plainOtp, hashedOtp);
  }

  getExpiryTime(minutes: number = this._expiryMinutes): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
