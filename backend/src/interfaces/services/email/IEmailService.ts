export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;

  sendPasswordResetEmail(
    email: string,
    resetUrl: string,
  ): Promise<void>;

  sendProviderPasswordSetupEmail(
    email: string,
    providerId: string,
    token: string,
  ): Promise<void>;
}