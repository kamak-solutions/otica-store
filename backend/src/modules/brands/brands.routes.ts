import type { FastifyInstance } from "fastify";

import {
  createBrandController,
  deleteBrandController,
  getBrandsController,
  updateBrandController,
} from "./brands.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

type BrandIdParams = {
  id: string;
};

export async function brandsRoutes(app: FastifyInstance) {
  app.get("/brands", getBrandsController);

  app.post(
    "/admin/brands",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    createBrandController,
  );

  app.put<{
    Params: BrandIdParams;
  }>(
    "/admin/brands/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    updateBrandController,
  );

  app.delete<{
    Params: BrandIdParams;
  }>(
    "/admin/brands/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    deleteBrandController,
  );
}
