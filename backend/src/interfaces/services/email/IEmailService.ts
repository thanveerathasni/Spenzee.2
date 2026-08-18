export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;

  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;

  sendProviderPasswordSetupEmail(
  email: string,
  token: string,
): Promise<void>;


}
