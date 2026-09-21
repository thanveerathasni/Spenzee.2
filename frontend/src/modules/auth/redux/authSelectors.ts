import type { RootState } from "@/store";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.accessToken);
