import { injectable } from "inversify";
import {TYPES} from "../../container/types";
import {container} from "../../container/index";
import { IEmailService } from "../../interfaces/services/email/IEmailService";
import { ILogger } from "../../shared/logger/ILogger";

const logger = container.get<ILogger>(TYPES.Logger);
@injectable()
export class EmailService
    implements IEmailService
{
    async sendOtp(
        email: string,
        otp: string,
    ): Promise<void> {
       logger.info(`Sending OTP email to ${email}`);

    }
}