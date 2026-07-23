import { injectable } from "inversify";

import { IEmailService } from "../../interfaces/services/email/IEmailService";

@injectable()
export class EmailService
    implements IEmailService
{
    async sendOtp(
        email: string,
        otp: string,
    ): Promise<void> {
        console.log(`
            Sending OTP ${otp} to ${email}
        `);

    }
}