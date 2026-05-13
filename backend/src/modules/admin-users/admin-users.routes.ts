import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  createAdminUserController,
  getAdminUsersController,
  updateAdminUserActiveController,
  updateAdminUserRoleController,
} from "./admin-users.controller.js";
import type {
  AdminUserIdParams,
  CreateAdminUserBody,
  UpdateAdminUserActiveBody,
  UpdateAdminUserRoleBody,
} from "./admin-users.schemas.js";

export async function adminUsersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/users",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    getAdminUsersController,
  );

  app.post<{
    Body: CreateAdminUserBody;
  }>(
    "/admin/users",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    createAdminUserController,
  );

  app.patch<{
    Params: AdminUserIdParams;
    Body: UpdateAdminUserRoleBody;
  }>(
    "/admin/users/:id/role",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    updateAdminUserRoleController,
  );

  app.patch<{
    Params: AdminUserIdParams;
    Body: UpdateAdminUserActiveBody;
  }>(
    "/admin/users/:id/active",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    updateAdminUserActiveController,
  );
}
