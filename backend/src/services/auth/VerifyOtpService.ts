import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";

import { TYPES } from "../../container/types";

import type { VerifyOtpDto } from "../../dtos/auth/VerifyOtp.dto";

import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";

@injectable()
export class VerifyOtpService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository,

        @inject(TYPES.PendingRegistrationRepository)
        private readonly pendingRegistrationRepository: IPendingRegistrationRepository,

        @inject(TYPES.OtpRepository)
        private readonly otpRepository: IOtpRepository,
    ) {}

    async execute(data: VerifyOtpDto): Promise<void> {
        const { email, otp } = data;

        // Find pending registration
        const pendingRegistration =
            await this.pendingRegistrationRepository.findByEmail(email);

        if (!pendingRegistration) {
            throw new Error("Pending registration not found.");
        }

        // Find OTP
        const storedOtp = await this.otpRepository.findByEmail(email);

        if (!storedOtp) {
            throw new Error("OTP not found.");
        }

        // Check expiry
        if (storedOtp.expiresAt.getTime() < Date.now()) {
            await this.otpRepository.deleteByEmail(email);
            throw new Error("OTP has expired.");
        }

        // Compare OTP
        const isValid = await bcrypt.compare(
            otp,
            storedOtp.code,
        );

        if (!isValid) {
            await this.otpRepository.incrementAttempts(email);
            throw new Error("Invalid OTP.");
        }

        // Create user
        await this.userRepository.create({
            firstName: pendingRegistration.firstName,
            lastName: pendingRegistration.lastName,
            email: pendingRegistration.email,
            password: pendingRegistration.password,
        });

        // Cleanup
        await this.otpRepository.deleteByEmail(email);
        await this.pendingRegistrationRepository.deleteByEmail(email);
    }
}