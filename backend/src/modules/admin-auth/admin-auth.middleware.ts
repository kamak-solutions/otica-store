import type { FastifyReply, FastifyRequest } from "fastify";

import {
  isAdminRole,
  verifyAdminToken,
  type AdminRole,
} from "../../lib/admin-jwt.js";

import { prisma } from "../../lib/prisma.js";

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

    const admin = await prisma.adminUser.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
      },
    });

    if (!admin || !admin.active || !isAdminRole(admin.role)) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Sessão administrativa inválida.",
      });
    }

    request.admin = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
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
    const adminRole = request.admin?.role;

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
