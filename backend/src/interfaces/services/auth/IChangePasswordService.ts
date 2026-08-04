import type { ChangePasswordDto } from "../../../dtos/auth/ChangePassword.dto";
import type { DecodedTokenPayload } from "./IJwtService";

export interface IChangePasswordService {
  execute(data: ChangePasswordDto, authenticatedUser: DecodedTokenPayload): Promise<void>;
}
