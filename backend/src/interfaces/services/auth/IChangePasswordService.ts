import type { DecodedTokenPayload } from "./IJwtService";
import type { ChangePasswordDto } from "../../../dtos/auth/ChangePassword.dto";

export interface IChangePasswordService {
  execute(data: ChangePasswordDto, authenticatedUser: DecodedTokenPayload): Promise<void>;
}
