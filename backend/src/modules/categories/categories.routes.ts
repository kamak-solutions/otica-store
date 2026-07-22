import type { FastifyInstance } from "fastify";

import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "./categories.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

type CategoryIdParams = {
  id: string;
};

export async function categoriesRoutes(app: FastifyInstance) {
  app.get("/categories", getCategoriesController);

  app.post(
    "/admin/categories",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    createCategoryController,
  );

  app.put<{
    Params: CategoryIdParams;
  }>(
    "/admin/categories/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    updateCategoryController,
  );

  app.delete<{
    Params: CategoryIdParams;
  }>(
    "/admin/categories/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner"]),
      ],
    },
    deleteCategoryController,
  );
}