export interface IProviderPasswordSetupService {
  execute(
    providerId: string,
    token: string,
    password: string,
  ): Promise<void>;




}
