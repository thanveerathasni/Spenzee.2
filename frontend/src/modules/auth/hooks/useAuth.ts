import { selectAuthUser, selectIsAuthenticated } from "../redux/authSelectors";

import { useAppSelector } from "@/store";


export function useAuth(): { isAuthenticated: boolean; user: ReturnType<typeof selectAuthUser> } {
  return {
    isAuthenticated: useAppSelector(selectIsAuthenticated),
    user: useAppSelector(selectAuthUser),
  };
}
