import { useAppSelector } from "@/store";

import { selectAuthUser, selectIsAuthenticated } from "../redux/authSelectors";

export function useAuth(): { isAuthenticated: boolean; user: ReturnType<typeof selectAuthUser> } {
  return {
    isAuthenticated: useAppSelector(selectIsAuthenticated),
    user: useAppSelector(selectAuthUser),
  };
}
