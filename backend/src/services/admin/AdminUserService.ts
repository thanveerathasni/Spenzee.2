import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AdminUserMapper } from "../../mappers/admin/AdminUserMapper";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { IAdminUser } from "../../dtos/admin/AdminUserDto";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IAdminUserService } from "../../interfaces/services/admin/IAdminUserService";

@injectable()
export class AdminUserService implements IAdminUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async getUsers(): Promise<IAdminUser[]> {
    const users = await this._userRepository.findAll();

    return AdminUserMapper.toDtoList(users);
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (!user.isActive) {
      return;
    }

    await this._userRepository.updateById(userId, {
      $set: {
        isActive: false,
      },
    });
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (user.isActive) {
      return;
    }

    await this._userRepository.updateById(userId, {
      $set: {
        isActive: true,
      },
    });
  }
}
