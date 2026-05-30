import type {
  FastifyInstance,
} from "fastify";

import {
  blogCategoryController,
} from "./blog-category.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

export async function blogCategoryRoutes(
  app: FastifyInstance,
) {
  app.get(
    "/blog/categories",
    blogCategoryController.list,
  );

  app.post(
    "/admin/blog/categories",
    {
      preHandler: [
        requireAdminAuth,

        requireAdminRole([
          "owner",
          "admin",
        ]),
      ],
    },
    blogCategoryController.create,
  );
}