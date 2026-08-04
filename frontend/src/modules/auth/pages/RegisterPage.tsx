import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEnvelope, HiLockClosed, HiUser } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

import { authService } from "@/modules/auth/services/authService";
import { registerSchema, type RegisterFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input, PasswordInput, PasswordStrengthIndicator } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
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
      title="Create account"
      subtitle="Start your journey to smarter spending."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* API Error */}
        {apiError && (
          <div
            role="alert"
            className="flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-lg)] bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-sm"
          >
            <span className="flex-shrink-0">⚠️</span>
            {apiError}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            {...register("firstName")}
            id="register-first-name"
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            autoFocus
            error={errors.firstName?.message}
            leftIcon={<HiUser className="h-4 w-4" />}
          />
          <Input
            {...register("lastName")}
            id="register-last-name"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            error={errors.lastName?.message}
          />
        </div>

        <Input
          {...register("email")}
          id="register-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          leftIcon={<HiEnvelope className="h-4 w-4" />}
        />

        <div className="flex flex-col gap-2">
          <PasswordInput
            {...register("password")}
            id="register-password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            leftIcon={<HiLockClosed className="h-4 w-4" />}
          />
          <PasswordStrengthIndicator password={password} />
        </div>

        <PasswordInput
          {...register("confirmPassword")}
          id="register-confirm-password"
          label="Confirm password"
          placeholder="Repeat your password"
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
          id="register-submit"
          className="shadow-lg shadow-violet-500/25 mt-2"
        >
          Create account
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-[var(--text-accent)] hover:opacity-80 transition-opacity"
          >
            Sign in
          </Link>
        </p>
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
