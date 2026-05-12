import type { FastifyReply, FastifyRequest } from "fastify";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";
import { loginAdmin } from "./admin-auth.service.js";
import {
  adminLoginBodySchema,
  type AdminLoginBody,
} from "./admin-auth.schemas.js";

export async function adminLoginController(
  request: FastifyRequest<{
    Body: AdminLoginBody;
  }>,
  reply: FastifyReply,
) {
  const body = adminLoginBodySchema.parse(request.body);

  request.log.info({ email: body.email }, "Admin login attempt");

  try {
    const { admin, token } = await loginAdmin(body);

    await createAdminAuditLog({
      adminId: admin.id,
      adminEmail: admin.email,
      adminRole: admin.role,
      action: "admin.login_success",
      entity: "AdminUser",
      entityId: admin.id,
      metadata: {
        email: body.email,
        ip: request.ip,
        userAgent: request.headers["user-agent"] ?? null,
      },
    });

    return reply.send({
      data: {
        admin,
        token,
      },
      message: "Login realizado com sucesso.",
    });
  } catch (error) {
    await createAdminAuditLog({
      adminEmail: body.email,
      action: "admin.login_failed",
      entity: "AdminUser",
      metadata: {
        email: body.email,
        ip: request.ip,
        userAgent: request.headers["user-agent"] ?? null,
        reason: "invalid_credentials_or_inactive_user",
      },
    });

    throw error;
  }
}