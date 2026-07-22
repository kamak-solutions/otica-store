import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const ADMIN_JWT_ISSUER = "otica-showroom-api";
const ADMIN_JWT_AUDIENCE = "otica-showroom-admin";
const ADMIN_JWT_ALGORITHM = "HS256";

export type AdminRole = "owner" | "admin" | "collaborator" | "viewer";

export type AdminJwtPayload = {
  sub: string;
  email: string;
  role: AdminRole;
};

export function signAdminToken(payload: AdminJwtPayload) {
  if (!env.ADMIN_JWT_SECRET) {
    throw new AppError("JWT secret não configurado.", 500, "Server error");
  }

  return jwt.sign(payload, env.ADMIN_JWT_SECRET, {
    algorithm: ADMIN_JWT_ALGORITHM,
    expiresIn: "1d",
    issuer: ADMIN_JWT_ISSUER,
    audience: ADMIN_JWT_AUDIENCE,
  });
}

export function isAdminRole(value: unknown): value is AdminRole {
  return (
    value === "owner" ||
    value === "admin" ||
    value === "collaborator" ||
    value === "viewer"
  );
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  if (!env.ADMIN_JWT_SECRET) {
    throw new AppError("JWT secret não configurado.", 500, "Server error");
  }

  try {
    const decoded = jwt.verify(token, env.ADMIN_JWT_SECRET, {
      algorithms: [ADMIN_JWT_ALGORITHM],
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      !isAdminRole(decoded.role)
    ) {
      throw new Error("Payload administrativo inválido.");
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    throw new AppError("Token inválido ou expirado.", 401, "Unauthorized");
  }
}
