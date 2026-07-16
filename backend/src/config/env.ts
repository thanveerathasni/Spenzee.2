import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),

  NODE_ENV: process.env.NODE_ENV ?? "development",

  MONGO_URI: getEnv("MONGO_URI"),

  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),

  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET")
};