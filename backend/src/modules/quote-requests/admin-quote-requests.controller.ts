import type { FastifyReply, FastifyRequest } from "fastify";
import { mapQuoteRequestToHttp } from "./quote-requests.mapper.js";
import {
  listQuoteRequests,
  updateQuoteRequestStatus,
} from "./quote-requests.service.js";
import {
  updateQuoteRequestStatusBodySchema,
  updateQuoteRequestStatusParamsSchema,
  type UpdateQuoteRequestStatusBody,
  type UpdateQuoteRequestStatusParams,
} from "./admin-quote-requests.schemas.js";

export async function listAdminQuoteRequestsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const quoteRequests = await listQuoteRequests();

  return reply.send({
    data: quoteRequests.map(mapQuoteRequestToHttp),
  });
}

export async function updateAdminQuoteRequestStatusController(
  request: FastifyRequest<{
    Params: UpdateQuoteRequestStatusParams;
    Body: UpdateQuoteRequestStatusBody;
  }>,
  reply: FastifyReply,
) {
  const params = updateQuoteRequestStatusParamsSchema.parse(request.params);
  const body = updateQuoteRequestStatusBodySchema.parse(request.body);

  const quoteRequest = await updateQuoteRequestStatus(params.id, body.status);

  return reply.send({
    data: mapQuoteRequestToHttp(quoteRequest),
    message: "Status da solicitação atualizado com sucesso.",
  });
}