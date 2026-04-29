import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

function isPrismaUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isPrismaRecordNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "Validation error",
      message: "Dados inválidos.",
      issues: error.issues,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: "Application error",
      message: error.message,
    });
  }

  if (isPrismaUniqueConstraintError(error)) {
    return reply.status(409).send({
      error: "Conflict",
      message: "Já existe um registro com dados únicos informados.",
    });
  }

  if (isPrismaRecordNotFoundError(error)) {
    return reply.status(404).send({
      error: "Not found",
      message: "Registro não encontrado.",
    });
  }

  return reply.status(500).send({
    error: "Internal server error",
    message: "Erro interno do servidor.",
  });
}