import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import {
  LandingPage,
  LoginPage,
  RegisterPage,
  VerifyOtpPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "@/modules/auth/pages";
import { Spinner } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { AppLayout } from "@/shared/layouts/AppLayout";
import {
  DashboardPlaceholder,
  LogoutSuccessPage,
  NotFoundPage,
  SessionExpiredPage,
  UnauthorizedPage,
} from "@/shared/pages";
import { PrivateRoute, PublicRoute, RoleRoute } from "@/shared/routes";
import { UserRole } from "@/shared/types";

function PageLoader(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] transition-colors duration-700">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
          Loading Workspace
        </span>
      </div>
    </div>
  );
}

export function AppRoutes(): React.JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page — public root */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />

        {/* Public-only routes (redirect to dashboard if authenticated) */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Status / Session Pages */}
        <Route path={ROUTES.LOGOUT_SUCCESS} element={<LogoutSuccessPage />} />
        <Route path={ROUTES.SESSION_EXPIRED} element={<SessionExpiredPage />} />

        {/* Private routes (redirect to login if not authenticated) */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPlaceholder />} />
            <Route path={ROUTES.PROFILE} element={<DashboardPlaceholder />} />

            {/* Admin-only */}
            <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path={ROUTES.ADMIN} element={<DashboardPlaceholder />} />
            </Route>

            {/* Provider-only */}
            <Route element={<RoleRoute allowedRoles={[UserRole.PROVIDER]} />}>
              <Route path={ROUTES.PROVIDER} element={<DashboardPlaceholder />} />
            </Route>
          </Route>
        </Route>

        {/* Utility pages */}
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />

        {/* Catch-all → 404 */}
        <Route path="*" element={<Navigate replace to={ROUTES.NOT_FOUND} />} />
      </Routes>
    </Suspense>
  );
}
