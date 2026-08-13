import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AuthFooter, AuthHeader } from "@/modules/auth/components";
import { authService } from "@/modules/auth/services/authService";
import { registerSchema, type RegisterFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input, PasswordInput, PasswordStrengthIndicator } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";

export function RegisterPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setApiError(null);

    try {
      await authService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created! Please verify your email.");
      void navigate(ROUTES.VERIFY_OTP, {
        replace: true,
        state: { email: values.email },
      });
    } catch (error) {
      const message = extractMessage(error, "Registration failed. Please try again.");
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      editorialTagline="Start Your Journey"
      editorialHeadingLine1="Join"
      editorialHeadingLine2="The"
      editorialHeadingAccent="Future."
      editorialDescription="Create your account and start taking control of your finances in minutes."
      stats={[
        ["Free", "Forever"],
        ["2 min", "Setup"],
        ["100%", "Secure"],
      ]}
    >
      <AuthHeader
        category={AUTH_MESSAGES.REGISTER.SUBHEADING}
        title={`Sign\nUp.`}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0 w-full" noValidate>
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

        {/* First & Last Name Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("firstName")}
            id="register-first-name"
            label={AUTH_MESSAGES.REGISTER.FIRST_NAME_LABEL}
            placeholder={AUTH_MESSAGES.REGISTER.FIRST_NAME_PLACEHOLDER}
            autoComplete="given-name"
            autoFocus
            error={errors.firstName?.message}
          />
          <Input
            {...register("lastName")}
            id="register-last-name"
            label={AUTH_MESSAGES.REGISTER.LAST_NAME_LABEL}
            placeholder={AUTH_MESSAGES.REGISTER.LAST_NAME_PLACEHOLDER}
            autoComplete="family-name"
            error={errors.lastName?.message}
          />
        </div>

        {/* Email Field */}
        <Input
          {...register("email")}
          id="register-email"
          type="email"
          label={AUTH_MESSAGES.REGISTER.EMAIL_LABEL}
          placeholder={AUTH_MESSAGES.REGISTER.EMAIL_PLACEHOLDER}
          autoComplete="email"
          error={errors.email?.message}
        />

        {/* Password Field */}
        <div className="flex flex-col gap-0 mt-2">
          <PasswordInput
            {...register("password")}
            id="register-password"
            label={AUTH_MESSAGES.REGISTER.PASSWORD_LABEL}
            placeholder={AUTH_MESSAGES.REGISTER.PASSWORD_PLACEHOLDER}
            autoComplete="new-password"
            error={errors.password?.message}
          />
          <div className="py-2">
            <PasswordStrengthIndicator password={password} />
          </div>
        </div>

        {/* Confirm Password Field */}
        <PasswordInput
          {...register("confirmPassword")}
          id="register-confirm-password"
          label={AUTH_MESSAGES.REGISTER.CONFIRM_PASSWORD_LABEL}
          placeholder={AUTH_MESSAGES.REGISTER.CONFIRM_PASSWORD_PLACEHOLDER}
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        {/* Submit Action Button */}
        <div className="border-t border-[var(--border-default)] pt-10">
          <Button
            type="submit"
            showArrowBox
            arrowText="Go"
            isLoading={isSubmitting}
            id="register-submit"
          >
            {isSubmitting ? "Processing..." : "Create account"}
          </Button>
        </div>
      </form>

      {/* Footer Navigation */}
      <AuthFooter
        promptText={AUTH_MESSAGES.REGISTER.HAVE_ACCOUNT}
        linkText={AUTH_MESSAGES.REGISTER.LOGIN_LINK}
        to={ROUTES.LOGIN}
      />
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
