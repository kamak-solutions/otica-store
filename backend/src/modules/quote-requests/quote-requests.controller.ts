import type { FastifyReply, FastifyRequest } from "fastify";
import { createQuoteRequest } from "./quote-requests.service.js";
import {
  createQuoteRequestBodySchema,
  type CreateQuoteRequestBody,
} from "./quote-requests.schemas.js";
import { mapQuoteRequestToHttp } from "./quote-requests.mapper.js";

export async function createQuoteRequestController(
  request: FastifyRequest<{ Body: CreateQuoteRequestBody }>,
  reply: FastifyReply,
) {
  const body = createQuoteRequestBodySchema.parse(request.body);

  const quoteRequest = await createQuoteRequest(body);

  return reply.status(201).send({
    data: mapQuoteRequestToHttp(quoteRequest),
    message: "Solicitação de orçamento enviada com sucesso.",
  });
}