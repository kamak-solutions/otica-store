import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../errors/app-error.js";
import { verifyAdminToken } from "../../lib/admin-jwt.js";

export async function requireAdminAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new AppError("Token não informado.", 401, "Unauthorized");
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Token inválido.", 401, "Unauthorized");
  }

  verifyAdminToken(token);
}