import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

const port = Number(process.env.PORT ?? 5000);

if (Number.isNaN(port)) {
  throw new Error("PORT must be a valid number");
}

export const env = {
  PORT: port,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: getEnv("MONGO_URI"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
} as const;
