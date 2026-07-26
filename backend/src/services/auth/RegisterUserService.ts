import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";

import { RegisterUserDto } from "../../dtos/auth/RegisterUser.dto";

import { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";

import { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";

import { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import { IOtpService } from "../../interfaces/services/auth/IOtpService";
import { IEmailService } from "../../interfaces/services/email/IEmailService";

@injectable()
export class RegisterUserService
    implements IRegisterUserService
{
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
    ) {}

 async execute(
    data: RegisterUserDto,
): Promise<void> { {

const existingUser = await this.userRepository.findByEmail(data.email)
const hashedPassword = await this.passwordService.hash(data.password)
const pendingRegistration = await this.pendingRegistrationRepository.findByEmail(data.email)
const otp = this.otpService.generateOtp()

const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
);

const hashedOtp = await this.otpService.hashOtp(otp)

const otpExpiresAt =  this.otpService.getExpiryTime()

const existingOtp = await this.otpRepository.findByEmail(data.email)

if(existingUser){
    throw new Error("user already exists")
}
if(pendingRegistration){
await this.pendingRegistrationRepository.updateByEmail( data.email,
    {firstName : data.firstName,
 lastName: data.lastName,
 
        password: hashedPassword,
        expiresAt,
})
}else{

await this.pendingRegistrationRepository.create({

  firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        expiresAt



})
}


if (existingOtp) {
    await this.otpRepository.updateByEmail(
        data.email,
        {
            code: hashedOtp,
            expiresAt: otpExpiresAt,
        },
    );
}else {
    await this.otpRepository.create({
        email: data.email,
        code: hashedOtp,
        expiresAt: otpExpiresAt,
    });
}

await this.emailService.sendOtp(
    data.email,
    otp,
);
console.log("Generated OTP:", otp);

    }
}

}