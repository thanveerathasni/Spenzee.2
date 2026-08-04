import type { ForgotPasswordDto } from "../../../dtos/auth/ForgotPassword.dto";

export interface IForgotPasswordService {
  execute(data: ForgotPasswordDto): Promise<void>;
}
