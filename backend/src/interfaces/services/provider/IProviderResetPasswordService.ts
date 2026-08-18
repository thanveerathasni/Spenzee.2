import type { ResetPasswordDto } from "../../../dtos/auth/ResetPassword.dto";

export interface IProviderResetPasswordService {
  execute(data: ResetPasswordDto): Promise<void>;
}
