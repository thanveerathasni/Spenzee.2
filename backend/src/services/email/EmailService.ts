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
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
            "
          >
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

            <p>
              If you didn't request this, you can safely ignore this email.
            </p>

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

  async sendPasswordResetEmail(
    email: string,
    resetUrl: string,
  ): Promise<void> {
    try {
      await this._mailer.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset your Spenzee password",
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 24px;
            "
          >
            <h2>Reset Your Spenzee Password</h2>

            <p>Hello,</p>

            <p>
              We received a request to reset your Spenzee password.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <div style="text-align:center; margin:32px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:14px 28px;
                  background:#000000;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Reset Your Password
              </a>
            </div>

            <p>
              This reset link is valid for 15 minutes.
            </p>

            <p>
              If you didn't request a password reset, you can safely ignore
              this email.
            </p>

            <hr />

            <p><strong>Spenzee Team</strong></p>
          </div>
        `,
      });

      this._logger.info(
        "Password reset email sent successfully.",
        { email },
      );
    } catch (error) {
      this._logger.error(
        "Failed to send password reset email.",
        error,
      );

      throw error;
    }
  }

  async sendProviderPasswordSetupEmail(
    email: string,
    providerId: string,
    token: string,
  ): Promise<void> {
    try {
      const setupUrl =
        `${env.FRONTEND_URL}/provider/setup-password` +
        `?providerId=${encodeURIComponent(providerId)}` +
        `&token=${encodeURIComponent(token)}`;

      await this._mailer.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Your Spenzee provider account is approved",
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 24px;
            "
          >
            <h2>Spenzee Provider Account Approved </h2>

            <p>Hello,</p>

            <p>
              Your Spenzee provider application has been approved.
              You can now create your password and access your provider
              account.
            </p>

            <div style="text-align:center; margin:32px 0;">
              <a
                href="${setupUrl}"
                style="
                  display:inline-block;
                  padding:14px 28px;
                  background:#000000;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Set Your Password
              </a>
            </div>

            <p>
              This setup link is valid for 15 minutes.
            </p>

            <p>
              If you did not expect this email, you can safely ignore it.
            </p>

            <hr />

            <p><strong>Spenzee Team</strong></p>
          </div>
        `,
      });

      this._logger.info(
        "Provider password setup email sent successfully.",
        { email },
      );
    } catch (error) {
      this._logger.error(
        "Failed to send provider password setup email.",
        error,
      );

      throw error;
    }
  }
}