import type { ResetPasswordDto } from "../../../dtos/auth/ResetPassword.dto";

export interface IResetPasswordService {
  execute(data: ResetPasswordDto): Promise<void>;
}
