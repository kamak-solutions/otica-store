import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export type AdminJwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export function signAdminToken(payload: AdminJwtPayload) {
  if (!env.ADMIN_JWT_SECRET) {
    throw new AppError("JWT secret não configurado.", 500, "Server error");
  }

  return jwt.sign(payload, env.ADMIN_JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAdminToken(token: string) {
  if (!env.ADMIN_JWT_SECRET) {
    throw new AppError("JWT secret não configurado.", 500, "Server error");
  }

  try {
    return jwt.verify(token, env.ADMIN_JWT_SECRET) as AdminJwtPayload;
  } catch {
    throw new AppError("Token inválido ou expirado.", 401, "Unauthorized");
  }
}