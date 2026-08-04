import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema, type LoginFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input, PasswordInput } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { AuthLayout } from "@/shared/layouts";
import { useAppDispatch } from "@/store";
import { loginThunk } from "@/store/authThunks";

export function LoginPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setApiError(null);

    const result = await dispatch(loginThunk(values));

    if (loginThunk.fulfilled.match(result)) {
      void navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      const errMsg = typeof result.payload === "string"
        ? result.payload
        : "Login failed. Please try again.";
      setApiError(errMsg);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Spenzee account to continue."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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

        <Input
          {...register("email")}
          id="login-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
          leftIcon={<HiEnvelope className="h-4 w-4" />}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordInput
            {...register("password")}
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            leftIcon={<HiLockClosed className="h-4 w-4" />}
          />
          <div className="flex justify-end">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-[var(--text-accent)] hover:opacity-80 transition-opacity font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          id="login-submit"
          className="shadow-lg shadow-violet-500/25 mt-1"
        >
          Sign in
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-[var(--text-accent)] hover:opacity-80 transition-opacity"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
