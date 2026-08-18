import type { ForgotPasswordDto } from "../../../dtos/auth/ForgotPassword.dto";

export interface IProviderForgotPasswordService {
  execute(data: ForgotPasswordDto): Promise<void>;
}
