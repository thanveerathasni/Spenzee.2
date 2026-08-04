import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiLockClosed, HiCheckCircle } from "react-icons/hi2";
import { useSearchParams, useNavigate } from "react-router-dom";

import { authService } from "@/modules/auth/services/authService";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, PasswordInput, PasswordStrengthIndicator } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";
import { logger } from "@/shared/logger";

export function ResetPasswordPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    if (!token || !email) {
      toast.error("Invalid or missing reset link. Please request a new one.");
      return;
    }

    setApiError(null);

    try {
      await authService.resetPassword({ email, token, password: values.password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      logger.info("Password reset successful.");

      setTimeout(() => {
        void navigate(ROUTES.LOGIN, { replace: true });
      }, 2500);
    } catch (error) {
      const msg = extractMessage(error, "Failed to reset password. The link may have expired.");
      setApiError(msg);
      toast.error(msg);
      logger.error("Password reset failed.", { error });
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6 py-6"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
            <HiCheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Password updated!</h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Your password has been reset. Redirecting you to sign in…
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

  if (!token || !email) {
    return (
      <AuthLayout title="Invalid link" subtitle="This reset link is invalid or has expired.">
        <Button
          variant="accent"
          size="md"
          fullWidth
          onClick={() => void navigate(ROUTES.FORGOT_PASSWORD)}
        >
          Request a new link
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Choose a strong password for your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {apiError && (
          <div
            role="alert"
            className="flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-lg)] bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-sm"
          >
            <span className="flex-shrink-0">⚠️</span>
            {apiError}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <PasswordInput
            {...register("password")}
            id="reset-password"
            label="New password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            autoFocus
            error={errors.password?.message}
            leftIcon={<HiLockClosed className="h-4 w-4" />}
          />
          <PasswordStrengthIndicator password={password} />
        </div>

        <PasswordInput
          {...register("confirmPassword")}
          id="reset-confirm-password"
          label="Confirm new password"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          leftIcon={<HiLockClosed className="h-4 w-4" />}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          id="reset-submit"
          className="shadow-lg shadow-violet-500/25 mt-1"
        >
          Reset password
        </Button>
      </form>
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
