import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
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

  SMTP_HOST: getEnv("SMTP_HOST"),

  SMTP_PORT: Number(getEnv("SMTP_PORT")),

  SMTP_USER: getEnv("SMTP_USER"),

  SMTP_PASS: getEnv("SMTP_PASS"),

  SMTP_FROM: getEnv("SMTP_FROM"),

  ADMIN_FIRST_NAME: getEnv("ADMIN_FIRST_NAME"),

  ADMIN_LAST_NAME: getEnv("ADMIN_LAST_NAME"),

  ADMIN_EMAIL: getEnv("ADMIN_EMAIL"),

  ADMIN_PASSWORD: getEnv("ADMIN_PASSWORD"),
} as const;
