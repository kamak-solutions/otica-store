import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createAttendanceController,
  getAttendanceByIdController,
  getAttendancesController,
} from "./attendances.controller.js";

export async function attendancesRoutes(app: FastifyInstance) {
  app.get(
    "/admin/attendances",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAttendancesController,
  );

  app.get<{
    Params: {
      id: string;
    };
  }>(
    "/admin/attendances/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAttendanceByIdController,
  );

  app.post<{
    Body: {
      customerId: string;
      type: string;
      notes?: string;
    };
  }>(
    "/admin/attendances",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createAttendanceController,
  );
}
