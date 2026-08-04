import type { AxiosInstance } from "axios";

import { authStorage } from "./authStorage";
import { logger } from "@/shared/logger";

export function configureInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const session = authStorage.getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error.response as { status?: number } | undefined)?.status
          : undefined;

      if (status === 401) {
        authStorage.clearSession();
        logger.warn("Authentication session cleared after an unauthorized response.");
      }

      return Promise.reject(error);
    },
  );
}
