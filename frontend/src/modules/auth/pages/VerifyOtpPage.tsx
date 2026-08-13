import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { HiCheckCircle } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { authService } from "@/modules/auth/services/authService";
import { BackButton, Button, OTPInput } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { useCountdown, useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";
import { logger } from "@/shared/logger";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

interface LocationState {
  email?: string;
}

export function VerifyOtpPage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const email = (location.state as LocationState | null)?.email ?? "";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const { seconds, isActive, reset } = useCountdown({
    initialSeconds: RESEND_COOLDOWN_SECONDS,
    autoStart: true,
  });

  // Redirect to register if no email in state
  useEffect(() => {
    if (!email) {
      void navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = useCallback(async (): Promise<void> => {
    if (otp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setOtpError(null);
    setIsVerifying(true);

    try {
      await authService.verifyOtp({ email, otp });
      setVerified(true);
      toast.success("Email verified successfully!");
      logger.info("OTP verification successful.");

      setTimeout(() => {
        void navigate(ROUTES.LOGIN, { replace: true });
      }, 2000);
    } catch (error) {
      const msg = extractMessage(error, "Invalid or expired verification code.");
      setOtpError(msg);
      toast.error(msg);
      logger.error("OTP verification failed.", { error });
    } finally {
      setIsVerifying(false);
    }
  }, [email, navigate, otp, toast]);

  const handleResend = useCallback(async (): Promise<void> => {
    if (isActive) return;

    setIsResending(true);
    setOtpError(null);
    setOtp("");

    try {
      await authService.resendOtp({ email });
      toast.success(`Verification code resent to ${email}`);
      reset(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const msg = extractMessage(error, "Failed to resend code. Please try again.");
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  }, [isActive, email, reset, toast]);

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !isVerifying && !verified) {
      void handleVerify();
    }
  }, [handleVerify, isVerifying, otp.length, verified]);

  if (verified) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 py-10 max-w-sm text-center"
        >
          <div className="w-16 h-16 border border-[var(--border-strong)] flex items-center justify-center mb-4">
            <HiCheckCircle className="h-8 w-8 text-[var(--text-primary)]" />
          </div>

          <AuthHeader
            category="Email Dispatched"
            title={`Code\nVerified.`}
            subtitle="Your email has been confirmed. Redirecting to sign in…"
          />
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      editorialTagline="Security Verification"
      editorialHeadingLine1="Verify"
      editorialHeadingLine2="Your"
      editorialHeadingAccent="Identity."
      editorialDescription={`Code dispatched to ${email || "your inbox"}. Enter the 6 digits below.`}
    >
      <AuthHeader
        category={`Code sent to ${email}`}
        title={`Verify\nEmail.`}
      />

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* OTP Input Component */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          error={otpError ?? undefined}
          disabled={isVerifying}
        />

        {/* Timer / Resend Row */}
        <div className="border-t border-[var(--border-default)] py-4 flex justify-between items-center">
          <span className="text-[9px] text-[var(--text-tertiary)] tracking-widest uppercase font-bold">
            One-time code
          </span>
          {seconds > 0 ? (
            <span className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase font-bold tabular-nums">
              Resend in {seconds}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={isResending}
              className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase underline underline-offset-4 font-bold"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="border-t border-[var(--border-default)] pt-10">
          <Button
            type="button"
            showArrowBox
            arrowText="Go"
            isLoading={isVerifying}
            disabled={otp.length < OTP_LENGTH || isVerifying}
            onClick={() => void handleVerify()}
            id="otp-verify-btn"
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </Button>
        </div>

        {/* Back Link */}
        <div className="border-t border-[var(--border-default)] pt-8 mt-4">
          <BackButton
            to={ROUTES.REGISTER}
            label={AUTH_MESSAGES.VERIFY_OTP.BACK_TO_REGISTER.replace("← ", "")}
          />
        </div>
      </div>
    </AuthLayout>
  );
}

function extractMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as Record<string, unknown>).response === "object"
  ) {
    const data = (error as Record<string, Record<string, unknown>>).response?.data;
    if (typeof data === "object" && data !== null && "message" in data) {
      return String(data.message);
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
