import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3333,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DATABASE_URL: process.env.DATABASE_URL || "",
};

export const isDevelopment = env.NODE_ENV !== "production";
export const isProduction = env.NODE_ENV === "production";