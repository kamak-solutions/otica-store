import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAdminToken } from "../../lib/admin-jwt.js";

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