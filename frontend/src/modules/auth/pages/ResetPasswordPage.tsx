import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle } from "react-icons/hi2";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { authService } from "@/modules/auth/services/authService";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, PasswordInput, PasswordStrengthIndicator } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
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
          className="flex flex-col items-center gap-6 py-10 max-w-sm text-center"
        >
          <div className="w-16 h-16 border border-[var(--border-strong)] flex items-center justify-center mb-4">
            <HiCheckCircle className="h-8 w-8 text-[var(--text-primary)]" />
          </div>

          <AuthHeader
            category="Password Updated"
            title={`Access\nReset.`}
            subtitle={AUTH_MESSAGES.RESET_PASSWORD.SUCCESS_SUBTITLE}
          />
        </motion.div>
      </AuthLayout>
    );
  }

  if (!token || !email) {
    return (
      <AuthLayout
        editorialTagline="Invalid Token"
        editorialHeadingLine1="Link"
        editorialHeadingLine2="Has"
        editorialHeadingAccent="Expired."
      >
        <AuthHeader
          category="Invalid Link"
          title={`Expired\nLink.`}
          subtitle="This reset link is invalid or has expired. Please request a new link."
        />
        <div className="pt-6 border-t border-[var(--border-default)]">
          <Button
            showArrowBox
            arrowText="Request"
            onClick={() => void navigate(ROUTES.FORGOT_PASSWORD)}
          >
            New link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      editorialTagline="Secure Recovery"
      editorialHeadingLine1="Create"
      editorialHeadingLine2="New"
      editorialHeadingAccent="Access."
      editorialDescription="Set a strong new password and continue your financial journey."
    >
      <AuthHeader
        category={AUTH_MESSAGES.RESET_PASSWORD.SUBHEADING}
        title={`Reset\nPass.`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0 max-w-sm w-full" noValidate>
        {/* API Error Notification */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              className="mb-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-xs tracking-wide uppercase font-semibold"
            >
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Password */}
        <div className="flex flex-col gap-0">
          <PasswordInput
            {...register("password")}
            id="reset-password"
            label={AUTH_MESSAGES.RESET_PASSWORD.NEW_PASSWORD_LABEL}
            placeholder={AUTH_MESSAGES.RESET_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
            autoComplete="new-password"
            autoFocus
            error={errors.password?.message}
          />
          <div className="py-2">
            <PasswordStrengthIndicator password={password} />
          </div>
        </div>

        {/* Confirm Password */}
        <PasswordInput
          {...register("confirmPassword")}
          id="reset-confirm-password"
          label={AUTH_MESSAGES.RESET_PASSWORD.CONFIRM_PASSWORD_LABEL}
          placeholder={AUTH_MESSAGES.RESET_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {/* Submit */}
        <div className="border-t border-[var(--border-default)] pt-10 mt-4">
          <Button
            type="submit"
            showArrowBox
            arrowText="Go"
            isLoading={isSubmitting}
            id="reset-submit"
          >
            {isSubmitting ? "Updating..." : "Reset password"}
          </Button>
        </div>
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
