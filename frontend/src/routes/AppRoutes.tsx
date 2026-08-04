import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/shared/layouts/AppLayout";
import { RouteSlot } from "@/shared/components/RouteSlot";
import { ROUTES } from "@/shared/constants";
import { PrivateRoute, PublicRoute, RoleRoute } from "@/shared/routes";
import { UserRole } from "@/shared/types";

export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path={ROUTES.ROOT} element={<Navigate replace to={ROUTES.DASHBOARD} />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<RouteSlot />} />
        <Route path={ROUTES.REGISTER} element={<RouteSlot />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<RouteSlot />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<RouteSlot />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<RouteSlot />} />
          <Route path={ROUTES.PROFILE} element={<RouteSlot />} />
          <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path={ROUTES.ADMIN} element={<RouteSlot />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={[UserRole.PROVIDER]} />}>
            <Route path={ROUTES.PROVIDER} element={<RouteSlot />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to={ROUTES.ROOT} />} />
    </Routes>
  );
}
