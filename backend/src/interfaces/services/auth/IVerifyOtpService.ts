import type { VerifyOtpDto } from "../../../dtos/auth/VerifyOtp.dto";

export interface IVerifyOtpService {
    execute(data: VerifyOtpDto): Promise<void>;
}