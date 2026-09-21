import type { AdminLoginResponseDto } from "../../dtos/auth/AdminLoginResponse.dto";
import type { ProviderLoginResponseDto } from "../../dtos/auth/ProviderLoginResponse.dto";
import type { UserLoginResponseDto } from "../../dtos/auth/UserLoginResponse.dto";
import type { IAdmin } from "../../models/Admin.model";
import type { IProvider } from "../../models/Provider.model";
import type { IUser } from "../../models/User.model";

export class AuthMapper {
  static toUserLoginResponse(
    user: IUser,
    accessToken: string,
    refreshToken: string,
  ): UserLoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id!.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    };
  }

  static toAdminLoginResponse(
    admin: IAdmin,
    accessToken: string,
    refreshToken: string,
  ): AdminLoginResponseDto {
    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin._id!.toString(),
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        isActive: admin.isActive,
      },
    };
  }

  static toProviderLoginResponse(
    provider: IProvider,
    accessToken: string,
    refreshToken: string,
  ): ProviderLoginResponseDto {
    return {
      accessToken,
      refreshToken,
      provider: {
        id: provider._id!.toString(),
        brandName: provider.brandName,
        email: provider.email,
        phone: provider.phone,
        primaryCategory: provider.primaryCategory,
        status: provider.status,
        commerceStatus: provider.commerceStatus,
        commerceEnabled: provider.commerceEnabled,
      },
    };
  }
}
