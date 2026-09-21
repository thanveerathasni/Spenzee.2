export interface ProviderLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  provider: {
    id: string;
    brandName: string;
    email: string;
    phone: string;
    primaryCategory: string;
    status: string;
    commerceStatus: string;
    commerceEnabled: boolean;
  };
}
