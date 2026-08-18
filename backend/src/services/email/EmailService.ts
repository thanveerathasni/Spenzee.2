import { inject, injectable } from "inversify";
import { Transporter } from "nodemailer";

import { env } from "../../config/env";
import { transporter } from "../../config/mail";
import { TYPES } from "../../container/types";

import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class EmailService implements IEmailService {
  private readonly _mailer: Transporter = transporter;

  constructor(
    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this._mailer.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Verify your Spenzee account",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <h2>Spenzee Account Verification</h2>

                        <p>Hello,</p>

                        <p>Use the OTP below to verify your account.</p>

                        <div
                            style="
                                font-size:32px;
                                font-weight:bold;
                                letter-spacing:8px;
                                text-align:center;
                                padding:20px;
                                margin:20px 0;
                                background:#f5f5f5;
                                border-radius:8px;
                            "
                        >
                            ${otp}
                        </div>

                        <p>This OTP is valid for 5 minutes.</p>

                        <p>If you didn't request this, you can safely ignore this email.</p>

                        <hr />

                        <p><strong>Spenzee Team</strong></p>
                    </div>
                `,
      });

      this._logger.info("OTP email sent successfully.", { email });
    } catch (error) {
      this._logger.error("Failed to send OTP email.", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      await this._mailer.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset your Spenzee password",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <h2>Password Reset</h2>

                        <p>Use the token below to reset your password.</p>

                        <div
                            style="
                                font-size:24px;
                                font-weight:bold;
                                text-align:center;
                                padding:20px;
                                margin:20px 0;
                                background:#f5f5f5;
                                border-radius:8px;
                                word-break:break-all;
                            "
                        >
                            ${resetToken}
                        </div>

                        <p>If you didn't request this, ignore this email.</p>

                        <hr />

                        <p><strong>Spenzee Team</strong></p>
                    </div>
                `,
      });

      this._logger.info("Password reset email sent successfully.", {
        email,
      });
    } catch (error) {
      this._logger.error("Failed to send password reset email.", error);
      throw error;
    }
  }
}
