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
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

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

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "quote_request.status_updated",
    entity: "QuoteRequest",
    entityId: quoteRequest.id,
    metadata: {
      newStatus: quoteRequest.status,
    },
  });

  return reply.send({
    data: mapQuoteRequestToHttp(quoteRequest),
    message: "Status da solicitação atualizado com sucesso.",
  });
}
