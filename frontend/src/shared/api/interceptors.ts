import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { authStorage } from "./authStorage";

import { AUTH_ROUTES } from "@/shared/constants";
import { logger } from "@/shared/logger";
import { clearSession, setSession } from "@/store/authSlice";
import { store } from "@/store/store";

interface QueueEntry {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else if (token) {
      entry.resolve(token);
    }
  });
  failedQueue = [];
}

export function configureInterceptors(client: AxiosInstance): void {
  /* -----------------------------------------------------------
     REQUEST INTERCEPTOR — Attach access token from Redux store
  ----------------------------------------------------------- */
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { auth } = store.getState();
    const token = auth.accessToken ?? authStorage.getSession()?.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  /* -----------------------------------------------------------
     RESPONSE INTERCEPTOR — Handle 401, refresh token, retry
  ----------------------------------------------------------- */
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isAxiosError(error)) {
        return Promise.reject(toError(error));
      }

      const status = error.response?.status;
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Skip refresh for the refresh endpoint itself or already-retried requests
      const isRefreshEndpoint = originalRequest.url?.includes(AUTH_ROUTES.REFRESH_TOKEN);
      if (status !== 401 || originalRequest._retry === true || isRefreshEndpoint) {
        return Promise.reject(toError(error));
      }

      if (isRefreshing) {
        return new Promise<unknown>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(client(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const session = authStorage.getSession();

      if (!session?.refreshToken) {
        handleLogout();
        isRefreshing = false;
        return Promise.reject(toError(error));
      }

      try {
        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${client.defaults.baseURL}${AUTH_ROUTES.REFRESH_TOKEN}`, {
          refreshToken: session.refreshToken,
        });

        const { accessToken, refreshToken } = data.data;
        const updatedSession = { ...session, accessToken, refreshToken };

        store.dispatch(setSession(updatedSession));
        authStorage.setSession(updatedSession);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        logger.info("Access token refreshed successfully.");

        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        logger.warn("Token refresh failed; session cleared.");
        return Promise.reject(toError(refreshError));
      } finally {
        isRefreshing = false;
      }
    },
  );
}

function handleLogout(): void {
  store.dispatch(clearSession());
  authStorage.clearSession();
  window.location.href = "/login";
}

function isAxiosError(
  error: unknown,
): error is { response?: { status?: number }; config: InternalAxiosRequestConfig } {
  return typeof error === "object" && error !== null && "response" in error && "config" in error;
}
