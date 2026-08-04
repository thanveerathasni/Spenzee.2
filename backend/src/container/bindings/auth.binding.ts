import type { Container } from "inversify";

import { TYPES } from "../types";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

import type { IPendingRegistrationRepository } from "../../interfaces/repositories/auth/IPendingRegistrationRepository";
import type { IOtpRepository } from "../../interfaces/repositories/auth/IOtpRepository";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";

import type { IRegisterUserService } from "../../interfaces/services/auth/IRegisterUserService";
import type { IVerifyOtpService } from "../../interfaces/services/auth/IVerifyOtpService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IOtpService } from "../../interfaces/services/auth/IOtpService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";

import { PendingRegistrationRepository } from "../../repositories/auth/PendingRegistrationRepository";
import { OtpRepository } from "../../repositories/auth/OtpRepository";
import { RefreshTokenRepository } from "../../repositories/auth/RefreshTokenRepository";
import { PasswordService } from "../../services/auth/PasswordService";
import { OtpService } from "../../services/auth/OtpService";
import { EmailService } from "../../services/email/EmailService";
import { RegisterUserService } from "../../services/auth/RegisterUserService";
import { VerifyOtpService } from "../../services/auth/VerifyOtpService";
import { JwtService } from "../../services/auth/JwtService";
import { LoginService } from "../../services/auth/LoginService";

import { AuthController } from "../../controllers/auth/AuthController";
import { AuthMiddleware } from "../../middlewares/AuthMiddleware";

export function registerAuthBindings(container: Container): void {
  container
    .bind<IPendingRegistrationRepository>(TYPES.PendingRegistrationRepository)
    .to(PendingRegistrationRepository);

  container.bind<IOtpRepository>(TYPES.OtpRepository).to(OtpRepository);

  container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);

  container.bind<IRegisterUserService>(TYPES.RegisterUserService).to(RegisterUserService);

  container.bind<IVerifyOtpService>(TYPES.VerifyOtpService).to(VerifyOtpService);

  container.bind<IJwtService>(TYPES.JwtService).to(JwtService);

  container.bind<ILoginService>(TYPES.LoginService).to(LoginService);

  container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

  container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

  container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService);

  container.bind<IOtpService>(TYPES.OtpService).to(OtpService);

  container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
}
