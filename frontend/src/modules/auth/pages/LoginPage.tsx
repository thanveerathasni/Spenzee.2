import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { AuthFooter, AuthHeader } from "@/modules/auth/components";
import { loginSchema, type LoginFormValues } from "@/modules/auth/validation/authSchemas";
import { Button, Input, PasswordInput } from "@/shared/components/ui";
import { AUTH_MESSAGES, ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/hooks";
import { AuthLayout } from "@/shared/layouts";
import { useAppDispatch } from "@/store";
import { loginThunk } from "@/store/authThunks";

export function LoginPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      toast.success("Successfully signed in.");
      void navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      const errMsg =
        typeof result.payload === "string"
          ? result.payload
          : "Login failed. Please verify your credentials.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <AuthLayout
      editorialTagline="Finance Reimagined"
      editorialHeadingLine1="Own"
      editorialHeadingLine2="Your"
      editorialHeadingAccent="Money."
      editorialDescription="Smart expense tracking built for people who take their finances seriously."
    >
      {/* Editorial Header */}
      <AuthHeader
        category={AUTH_MESSAGES.LOGIN.SUBHEADING}
        title={`Sign\nIn.`}
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

        {/* Email Field */}
        <Input
          {...register("email")}
          id="login-email"
          type="email"
          label={AUTH_MESSAGES.LOGIN.EMAIL_LABEL}
          placeholder={AUTH_MESSAGES.LOGIN.EMAIL_PLACEHOLDER}
          autoComplete="email"
          autoFocus
          error={errors.email?.message}
        />

        {/* Password Field */}
        <div className="flex flex-col gap-0 mt-2">
          <PasswordInput
            {...register("password")}
            id="login-password"
            label={AUTH_MESSAGES.LOGIN.PASSWORD_LABEL}
            placeholder={AUTH_MESSAGES.LOGIN.PASSWORD_PLACEHOLDER}
            autoComplete="current-password"
            error={errors.password?.message}
          />

          {/* Forgot Password Link Row */}
          <div className="border-t border-[var(--border-default)] py-4 flex justify-between items-center">
            <span className="text-[9px] text-[var(--text-tertiary)] tracking-widest uppercase font-bold select-none">
              Credentials
            </span>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase font-bold"
            >
              {AUTH_MESSAGES.LOGIN.FORGOT_PASSWORD}
            </Link>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="border-t border-[var(--border-default)] pt-10">
          <Button
            type="submit"
            showArrowBox
            arrowText="Go"
            isLoading={isSubmitting}
            id="login-submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      {/* Footer Navigation */}
      <AuthFooter
        promptText={AUTH_MESSAGES.LOGIN.NO_ACCOUNT}
        linkText={AUTH_MESSAGES.LOGIN.CREATE_ACCOUNT_LINK}
        to={ROUTES.REGISTER}
      />
    </AuthLayout>
  );
}
