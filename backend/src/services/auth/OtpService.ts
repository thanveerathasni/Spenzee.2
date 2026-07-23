import bcrypt from "bcrypt";
import { injectable } from "inversify";

import { IOtpService } from "../../interfaces/services/auth/IOtpService";

@injectable()
export class OtpService implements IOtpService {
    private readonly saltRounds = 10;
    private readonly expiryMinutes = 5;

    generateOtp(): string {
        return Math.floor(
            100000 + Math.random() * 900000,
        ).toString();
    }

    async hashOtp(
        otp: string,
    ): Promise<string> {
        return bcrypt.hash(
            otp,
            this.saltRounds,
        );
    }

    async compareOtp(
        plainOtp: string,
        hashedOtp: string,
    ): Promise<boolean> {
        return bcrypt.compare(
            plainOtp,
            hashedOtp,
        );
    }

    getExpiryTime(
        minutes: number = this.expiryMinutes,
    ): Date {
        return new Date(
            Date.now() + minutes * 60 * 1000,
        );
    }
}