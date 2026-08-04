import { STORAGE_KEYS } from "@/shared/constants";
import type { AuthSession } from "@/shared/types";

export const authStorage = {
  getSession(): AuthSession | null {
    const value = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthSession;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      return null;
    }
  },

  setSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
  },

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },
};
