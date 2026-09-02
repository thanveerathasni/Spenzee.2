export interface UserLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
}
