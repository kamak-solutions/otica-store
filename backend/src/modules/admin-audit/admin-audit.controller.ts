import type { FastifyReply, FastifyRequest } from "fastify";
import { mapAdminAuditLogToHttp } from "./admin-audit.mapper.js";
import { listAdminAuditLogs } from "./admin-audit.service.js";

export async function listAdminAuditLogsController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const logs = await listAdminAuditLogs();

  return reply.send({
    data: logs.map(mapAdminAuditLogToHttp),
  });
}