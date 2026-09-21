const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "");

if (!apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is required.");
}

export const env = {
  API_BASE_URL: apiBaseUrl,
  IS_PRODUCTION: Boolean(import.meta.env.PROD),
} as const;
