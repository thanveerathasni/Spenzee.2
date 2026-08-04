import type { LogoutRequestDto } from "../../../dtos/auth/Logout.dto";

export interface ILogoutService {
  execute(data: LogoutRequestDto): Promise<void>;
}
