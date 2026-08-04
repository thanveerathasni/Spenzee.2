import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEnvelope, HiCheckCircle, HiArrowLeft } from "react-icons/hi2";
import { Link } from "react-router-dom";

import { authService } from "@/modules/auth/services/authService";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";
import { logger } from "@/shared/logger";

export function ForgotPasswordPage(): React.JSX.Element {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    try {
      await authService.requestPasswordReset({ email: values.email });
      setSentTo(values.email);
      setSubmitted(true);
      logger.info("Password reset email requested.");
    } catch (error) {
      const msg = extractMessage(error, "Failed to send reset email. Please try again.");
      toast.error(msg);
      logger.error("Forgot password request failed.", { error });
    }
  };

  if (submitted) {
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
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Check your email</h2>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs leading-relaxed">
              We sent a password reset link to{" "}
              <span className="font-semibold text-[var(--text-primary)]">{sentTo}</span>. It will
              expire in 15 minutes.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-lg)] bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
              <HiEnvelope className="h-5 w-5 text-[var(--text-tertiary)] flex-shrink-0" />
              <p className="text-xs text-[var(--text-secondary)]">
                Didn&apos;t receive it? Check your spam folder or request another email.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setSubmitted(false)}
            >
              Try a different email
            </Button>

            <Link
              to={ROUTES.LOGIN}
              className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <HiArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your account email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          {...register("email")}
          id="forgot-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          leftIcon={<HiEnvelope className="h-4 w-4" />}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          id="forgot-submit"
          className="shadow-lg shadow-violet-500/25"
        >
          Send reset link
        </Button>

        <Link
          to={ROUTES.LOGIN}
          className="flex items-center justify-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
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
