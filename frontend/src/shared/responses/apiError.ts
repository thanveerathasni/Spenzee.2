import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@/shared/types";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorResponse | undefined)?.message ?? fallback;
  }

  return fallback;
}
