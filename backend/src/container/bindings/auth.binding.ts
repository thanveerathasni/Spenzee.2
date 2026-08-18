
import { AuthController } from "../../controllers/auth/AuthController";
import { ProviderController } from "../../controllers/provider/ProviderController";
import { ProviderForgotPasswordController } from "../../controllers/provider/ProviderForgotPasswordController";
import { ProviderLoginController } from "../../controllers/provider/ProviderLoginController";
import { ProviderPasswordSetupController } from "../../controllers/provider/ProviderPasswordSetupController";
import { ProviderResetPasswordController } from "../../controllers/provider/ProviderResetPasswordController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";
import { OtpRepository } from "../../repositories/auth/OtpRepository";
import { PendingRegistrationRepository } from "../../repositories/auth/PendingRegistrationRepository";
import { RefreshTokenRepository } from "../../repositories/auth/RefreshTokenRepository";
import { ResetPasswordTokenRepository } from "../../repositories/auth/ResetPasswordTokenRepository";
import { ProviderPasswordSetupTokenRepository } from "../../repositories/provider/ProviderPasswordSetupTokenRepository";
import { ProviderRepository } from "../../repositories/provider/ProviderRepository";
import { ProviderResetPasswordTokenRepository } from "../../repositories/provider/ProviderResetPasswordTokenRepository";
import { ChangePasswordService } from "../../services/auth/ChangePasswordService";
import { ForgotPasswordService } from "../../services/auth/ForgotPasswordService";
import { JwtService } from "../../services/auth/JwtService";
import { LoginService } from "../../services/auth/LoginService";
import { LogoutService } from "../../services/auth/LogoutService";
import { OtpService } from "../../services/auth/OtpService";
import { PasswordService } from "../../services/auth/PasswordService";
import { RefreshTokenService } from "../../services/auth/RefreshTokenService";
import { RegisterUserService } from "../../services/auth/RegisterUserService";
import { ResetPasswordService } from "../../services/auth/ResetPasswordService";
import { VerifyOtpService } from "../../services/auth/VerifyOtpService";
import { EmailService } from "../../services/email/EmailService";
import { ApplyProviderService } from "../../services/provider/ApplyProviderService";
import { ProviderForgotPasswordService } from "../../services/provider/ProviderForgotPasswordService";
import { ProviderLoginService } from "../../services/provider/ProviderLoginService";
import { ProviderPasswordSetupService } from "../../services/provider/ProviderPasswordSetupService";
import { ProviderResetPasswordService } from "../../services/provider/ProviderResetPasswordService";
import { TYPES } from "../types";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IProviderController } from "../../interfaces/controllers/provider/IProviderController";
import type { IProviderForgotPasswordController } from "../../interfaces/controllers/provider/IProviderForgotPasswordController";
import type { IProviderLoginController } from "../../interfaces/controllers/provider/IProviderLoginController";
import type { IProviderPasswordSetupController } from "../../interfaces/controllers/provider/IProviderPasswordSetupController";
import type { IProviderResetPasswordController } from "../../interfaces/controllers/provider/IProviderResetPasswordController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IResetPasswordTokenRepository } from "../../interfaces/repositories/auth/IResetPasswordTokenRepository";
import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IChangePasswordService } from "../../interfaces/services/auth/IChangePasswordService";
import type { IForgotPasswordService } from "../../interfaces/services/auth/IForgotPasswordService";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";
import type { ILogoutService } from "../../interfaces/services/auth/ILogoutService";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IRefreshTokenService } from "../../interfaces/services/auth/IRefreshTokenService";
import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IResetPasswordService } from "../../interfaces/services/auth/IResetPasswordService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { IApplyProviderService } from "../../interfaces/services/provider/IApplyProviderService";
import type { IProviderForgotPasswordService } from "../../interfaces/services/provider/IProviderForgotPasswordService";
import type { IProviderLoginService } from "../../interfaces/services/provider/IProviderLoginService";
import type { IProviderPasswordSetupService } from "../../interfaces/services/provider/IProviderPasswordSetupService";
import type { IProviderResetPasswordService } from "../../interfaces/services/provider/IProviderResetPasswordService";
import type { Container } from "inversify";

export function registerAuthBindings(container: Container): void {
  container
    .bind<IPendingRegistrationRepository>(TYPES.PendingRegistrationRepository)
    .to(PendingRegistrationRepository);

  container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);

  container
    .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
    .to(RefreshTokenRepository);

  container
    .bind<IResetPasswordTokenRepository>(TYPES.ResetPasswordTokenRepository)
    .to(ResetPasswordTokenRepository);

  container
    .bind<IRegisterUserService>(TYPES.RegisterUserService)
    .to(RegisterUserService);

  container
    .bind<IVerifyOtpService>(TYPES.VerifyOtpService)
    .to(VerifyOtpService);

  container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService);

  container.bind<IOtpService>(TYPES.OtpService).to(OtpService);

  container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

  container.bind<IJwtService>(TYPES.JwtService).to(JwtService);

  container.bind<ILoginService>(TYPES.LoginService).to(LoginService);

  container
    .bind<IRefreshTokenService>(TYPES.RefreshTokenService)
    .to(RefreshTokenService);

  container.bind<ILogoutService>(TYPES.LogoutService).to(LogoutService);

  container
    .bind<IForgotPasswordService>(TYPES.ForgotPasswordService)
    .to(ForgotPasswordService);

  container
    .bind<IResetPasswordService>(TYPES.ResetPasswordService)
    .to(ResetPasswordService);

  container
    .bind<IChangePasswordService>(TYPES.ChangePasswordService)
    .to(ChangePasswordService);

  container
    .bind<IAuthController>(TYPES.AuthController)
    .to(AuthController);

  container
    .bind<IAuthMiddleware>(TYPES.AuthMiddleware)
    .to(AuthMiddleware);

  container
    .bind<IProviderRepository>(TYPES.ProviderRepository)
    .to(ProviderRepository);

  container
    .bind<IProviderResetPasswordTokenRepository>(
      TYPES.ProviderResetPasswordTokenRepository,
    )
    .to(ProviderResetPasswordTokenRepository);

  container
    .bind<IProviderForgotPasswordService>(TYPES.ProviderForgotPasswordService)
    .to(ProviderForgotPasswordService);

  container
    .bind<IProviderResetPasswordService>(TYPES.ProviderResetPasswordService)
    .to(ProviderResetPasswordService);

  container
    .bind<IApplyProviderService>(TYPES.ApplyProviderService)
    .to(ApplyProviderService);

  container
    .bind<IProviderController>(TYPES.ProviderController)
    .to(ProviderController);

  container
    .bind<IProviderForgotPasswordController>(
      TYPES.ProviderForgotPasswordController,
    )
    .to(ProviderForgotPasswordController);

  container
    .bind<IProviderResetPasswordController>(
      TYPES.ProviderResetPasswordController,
    )
    .to(ProviderResetPasswordController);

    container
  .bind<IProviderPasswordSetupTokenRepository>(
    TYPES.ProviderPasswordSetupTokenRepository,
  )
  .to(ProviderPasswordSetupTokenRepository);


  container
  .bind<IProviderPasswordSetupService>(
    TYPES.ProviderPasswordSetupService,
  )
  .to(ProviderPasswordSetupService);

  container

container
  .bind<IProviderPasswordSetupController>(TYPES.ProviderPasswordSetupController)
  .to(ProviderPasswordSetupController);

container
  .bind<IProviderLoginService>(TYPES.ProviderLoginService)
  .to(ProviderLoginService);

container
  .bind<IProviderLoginController>(TYPES.ProviderLoginController)
  .to(ProviderLoginController);

  
}

