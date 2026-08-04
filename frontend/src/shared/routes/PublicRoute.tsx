import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { useAppSelector } from "@/store";

export function PublicRoute(): React.JSX.Element {
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.accessToken));

  return isAuthenticated ? <Navigate replace to={ROUTES.DASHBOARD} /> : <Outlet />;
}
