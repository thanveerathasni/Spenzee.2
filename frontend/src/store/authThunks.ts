import { createAsyncThunk } from "@reduxjs/toolkit";

import { clearSession, setSession } from "./authSlice";
import { addNotification } from "./notificationSlice";

import type { AppDispatch, RootState } from "./store";
import type { LoginRequest } from "@/modules/auth/types/auth.types";

import { authService } from "@/modules/auth/services/authService";
import { authStorage } from "@/shared/api";
import { logger } from "@/shared/logger";

type ThunkConfig = {
  dispatch: AppDispatch;
  state: RootState;
};

/* =========================================================
   LOGIN THUNK
   ========================================================= */

export const loginThunk = createAsyncThunk<void, LoginRequest, ThunkConfig>(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const session = await authService.login(credentials);
      dispatch(setSession(session));
      dispatch(addNotification("Welcome back! You've logged in successfully.", "success"));
      logger.info("User logged in successfully.");
    } catch (error) {
      const message = extractErrorMessage(error, "Login failed. Please check your credentials.");
      dispatch(addNotification(message, "error"));
      logger.error("Login failed.", { error });
      return rejectWithValue(message);
    }
  },
);

/* =========================================================
   LOGOUT THUNK
   ========================================================= */

export const logoutThunk = createAsyncThunk<void, void, ThunkConfig>(
  "auth/logout",
  async (_, { dispatch, getState }) => {
    const { auth } = getState();

    try {
      if (auth.refreshToken) {
        await authService.logout(auth.refreshToken);
      }
    } catch (error) {
      logger.warn("Logout API call failed; clearing session locally.", { error });
    } finally {
      dispatch(clearSession());
      authStorage.clearSession();
      dispatch(addNotification("You've been logged out successfully.", "info"));
      logger.info("User session cleared.");
    }
  },
);

/* =========================================================
   HELPERS
   ========================================================= */

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as Record<string, unknown>).response === "object"
  ) {
    const response = (error as Record<string, Record<string, unknown>>).response;
    const data = response?.data;

    if (typeof data === "object" && data !== null && "message" in data) {
      return String(data.message);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
