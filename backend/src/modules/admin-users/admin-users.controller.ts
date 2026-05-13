import type { FastifyReply, FastifyRequest } from "fastify";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";
import {
  adminUserIdParamsSchema,
  createAdminUserBodySchema,
  updateAdminUserActiveBodySchema,
  updateAdminUserRoleBodySchema,
  type AdminUserIdParams,
  type CreateAdminUserBody,
  type UpdateAdminUserActiveBody,
  type UpdateAdminUserRoleBody,
} from "./admin-users.schemas.js";
import {
  createAdminUser,
  listAdminUsers,
  updateAdminUserActive,
  updateAdminUserRole,
} from "./admin-users.service.js";

export async function getAdminUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin users");

  const users = await listAdminUsers();

  return reply.send({
    data: users,
  });
}

export async function createAdminUserController(
  request: FastifyRequest<{
    Body: CreateAdminUserBody;
  }>,
  reply: FastifyReply,
) {
  const body = createAdminUserBodySchema.parse(request.body);

  request.log.info({ email: body.email, role: body.role }, "Creating admin user");

  const user = await createAdminUser(body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "admin_user.created",
    entity: "AdminUser",
    entityId: user.id,
    metadata: {
      email: user.email,
      role: user.role,
    },
  });

  return reply.status(201).send({
    data: user,
    message: "Usuário admin criado com sucesso.",
  });
}

export async function updateAdminUserRoleController(
  request: FastifyRequest<{
    Params: AdminUserIdParams;
    Body: UpdateAdminUserRoleBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = adminUserIdParamsSchema.parse(request.params);
  const body = updateAdminUserRoleBodySchema.parse(request.body);

  request.log.info({ id, role: body.role }, "Updating admin user role");

  const user = await updateAdminUserRole(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "admin_user.role_updated",
    entity: "AdminUser",
    entityId: user.id,
    metadata: {
      email: user.email,
      role: user.role,
    },
  });

  return reply.send({
    data: user,
    message: "Perfil do usuário admin atualizado com sucesso.",
  });
}

export async function updateAdminUserActiveController(
  request: FastifyRequest<{
    Params: AdminUserIdParams;
    Body: UpdateAdminUserActiveBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = adminUserIdParamsSchema.parse(request.params);
  const body = updateAdminUserActiveBodySchema.parse(request.body);

  request.log.info({ id, active: body.active }, "Updating admin user active status");

  const user = await updateAdminUserActive(id, body, request.admin?.sub);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "admin_user.active_updated",
    entity: "AdminUser",
    entityId: user.id,
    metadata: {
      email: user.email,
      active: user.active,
    },
  });

  return reply.send({
    data: user,
    message: "Status do usuário admin atualizado com sucesso.",
  });
}
