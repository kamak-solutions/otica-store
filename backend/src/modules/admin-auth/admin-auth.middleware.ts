
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAdminToken } from "../../lib/admin-jwt.js";

export type AdminRole = "owner" | "admin" | "collaborator" | "viewer";

export async function requireAdminAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token não informado.",
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token inválido.",
    });
  }

  try {
    const payload = verifyAdminToken(token);

    request.admin = payload;
  } catch {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "Token inválido ou expirado.",
    });
  }
}

export function requireAdminRole(allowedRoles: AdminRole[]) {
  return async function requireAdminRoleHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const adminRole = request.admin?.role as AdminRole | undefined;

    if (!adminRole) {
      return reply.status(403).send({
        error: "Forbidden",
        message: "Perfil administrativo não identificado.",
      });
    }

    if (!allowedRoles.includes(adminRole)) {
      return reply.status(403).send({
        error: "Forbidden",
        message: "Você não tem permissão para executar esta ação.",
      });
    }
  };
}