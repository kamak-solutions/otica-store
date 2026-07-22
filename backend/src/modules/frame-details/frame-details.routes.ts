import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createFrameDetailsController,
  getFrameDetailsByProductController,
  updateFrameDetailsController,
} from "./frame-details.controller.js";

import type {
  CreateFrameDetailsBody,
  ProductFrameDetailsParams,
  UpdateFrameDetailsBody,
} from "./frame-details.schemas.js";

export async function frameDetailsRoutes(app: FastifyInstance) {
  app.get<{
    Params: ProductFrameDetailsParams;
  }>(
    "/admin/products/:productId/frame-details",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getFrameDetailsByProductController,
  );

  app.post<{
    Params: ProductFrameDetailsParams;
    Body: CreateFrameDetailsBody;
  }>(
    "/admin/products/:productId/frame-details",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    createFrameDetailsController,
  );

  app.put<{
    Params: ProductFrameDetailsParams;
    Body: UpdateFrameDetailsBody;
  }>(
    "/admin/products/:productId/frame-details",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    updateFrameDetailsController,
  );
}