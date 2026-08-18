export interface AdminLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    isActive: boolean;
  };
}



