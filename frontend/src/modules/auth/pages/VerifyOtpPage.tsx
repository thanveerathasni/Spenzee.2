import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiEnvelope, HiArrowLeft, HiCheckCircle } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";

import { authService } from "@/modules/auth/services/authService";
import { Button, OTPInput } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
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
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect to register if no email in state
  useEffect(() => {
    if (!email) {
      void navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetCountdown = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(RESEND_COOLDOWN_SECONDS);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleVerify = useCallback(async (): Promise<void> => {
    if (otp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit OTP.");
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
      const msg = extractMessage(error, "Invalid or expired OTP. Please try again.");
      setOtpError(msg);
      toast.error(msg);
      logger.error("OTP verification failed.", { error });
    } finally {
      setIsVerifying(false);
    }
  }, [email, navigate, otp, toast]);

  const handleResend = useCallback(async (): Promise<void> => {
    if (countdown > 0) return;

    setIsResending(true);
    setOtpError(null);
    setOtp("");

    try {
      await authService.resendOtp({ email });
      toast.success("A new OTP has been sent to your email.");
      resetCountdown();
    } catch (error) {
      const msg = extractMessage(error, "Failed to resend OTP. Please try again.");
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  }, [countdown, email, resetCountdown, toast]);

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
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6 py-8"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
            <HiCheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Email Verified!
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              Your account is verified. Redirecting you to login…
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
            ))}
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email}. Enter it below to activate your account.`}
    >
      <div className="flex flex-col gap-8">
        {/* Email icon */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10">
            <HiEnvelope className="h-8 w-8 text-violet-500" />
          </div>
        </motion.div>

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <OTPInput
            value={otp}
            onChange={setOtp}
            error={otpError ?? undefined}
            disabled={isVerifying}
          />
        </motion.div>

        {/* Verify button */}
        <Button
          type="button"
          variant="accent"
          size="lg"
          fullWidth
          isLoading={isVerifying}
          disabled={otp.length < OTP_LENGTH || isVerifying}
          onClick={() => void handleVerify()}
          id="otp-verify-btn"
          className="shadow-lg shadow-violet-500/25"
        >
          Verify email
        </Button>

        {/* Resend section */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-[var(--text-secondary)]">Didn&apos;t receive the code?</p>

          {countdown > 0 ? (
            <p className="text-sm font-medium text-[var(--text-tertiary)]">
              Resend in{" "}
              <span className="text-[var(--text-accent)] tabular-nums font-bold">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={isResending}
              className="text-sm font-semibold text-[var(--text-accent)] hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending…" : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Back to register */}
        <button
          type="button"
          onClick={() => void navigate(ROUTES.REGISTER)}
          className="flex items-center justify-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to registration
        </button>
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
