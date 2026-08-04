import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import type { UserRole } from "@/shared/types";
import { useAppSelector } from "@/store";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps): React.JSX.Element {
  const role = useAppSelector((state) => state.auth.user?.role);

  return role && allowedRoles.includes(role) ? <Outlet /> : <Navigate replace to={ROUTES.DASHBOARD} />;
}
