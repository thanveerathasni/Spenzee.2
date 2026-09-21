import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiCheckCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

import { AuthHeader } from "@/modules/auth/components";
import { authService } from "@/modules/auth/services/authService";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input } from "@/shared/components/ui";

import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";
import { logger } from "@/shared/logger";

export function ForgotPasswordPage(): React.JSX.Element {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

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
      <AuthLayout
        editorialTagline="Security Recovery"
        editorialHeadingLine1="Email"
        editorialHeadingLine2="Dispatched."
        editorialHeadingAccent="Check Inbox."
        editorialDescription="Follow the instructions sent to your email to reset your access code."
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-sm w-full"
        >
          <AuthHeader
            category={AUTH_MESSAGES.FORGOT_PASSWORD.SUBHEADING}
            title={`Check\nInbox.`}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
            className="w-16 h-16 border border-[var(--border-strong)] flex items-center justify-center mb-10"
          >
            <HiCheckCircle className="h-8 w-8 text-[var(--text-primary)]" />
          </motion.div>

          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-10 max-w-[280px]">
            {AUTH_MESSAGES.FORGOT_PASSWORD.SUCCESS_SUBTITLE}
          </p>

          <div className="border-t border-[var(--border-default)] pt-10 flex flex-col gap-4">
            <Link to={ROUTES.LOGIN}>
              <Button showArrowBox arrowText="Login">
                Sign in
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase text-left mt-2"
            >
              {AUTH_MESSAGES.FORGOT_PASSWORD.TRY_DIFFERENT_EMAIL}
            </button>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      editorialTagline="Account Recovery"
      editorialHeadingLine1="Reset"
      editorialHeadingLine2="Your"
      editorialHeadingAccent="Access."
      editorialDescription="We'll send a secure link directly to your inbox. Back in seconds."
    >
      <AuthHeader
        category={AUTH_MESSAGES.FORGOT_PASSWORD.SUBHEADING}
        title={`Forgot\nPass.`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0 max-w-sm w-full" noValidate>
        {/* Email Address */}
        <Input
          {...register("email")}
          id="forgot-email"
          type="email"
          label={AUTH_MESSAGES.FORGOT_PASSWORD.EMAIL_LABEL}
          placeholder={AUTH_MESSAGES.FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
        />

        {/* Back Link */}
        <div className="border-t border-[var(--border-default)] py-4 flex justify-between items-center">
          <span className="text-[9px] text-[var(--text-tertiary)] tracking-widest uppercase font-bold select-none">
            Registered email
          </span>
          <Link
            to={ROUTES.LOGIN}
            className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase font-bold"
          >
            Back to login
          </Link>
        </div>

        {/* Submit */}
        <div className="border-t border-[var(--border-default)] pt-10">
          <Button
            type="submit"
            showArrowBox
            arrowText="Send"
            isLoading={isSubmitting}
            id="forgot-submit"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
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
