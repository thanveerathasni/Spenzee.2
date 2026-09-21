import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { useAppSelector } from "@/store";

export function PrivateRoute(): React.JSX.Element {
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.accessToken));

  return isAuthenticated ? <Outlet /> : <Navigate replace to={ROUTES.LOGIN} />;
}
