import type { FastifyInstance } from "fastify";

import { blogController } from "./blog.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

export async function blogRoutes(app: FastifyInstance) {
  app.get("/blog/posts", blogController.listPublic);

  app.get("/blog/posts/:slug", blogController.findBySlug);

  app.get(
    "/admin/blog/posts",
    {
      preHandler: [requireAdminAuth],
    },
    blogController.listAdmin,
  );

  app.post(
    "/admin/blog/posts",
    {
      preHandler: [
        requireAdminAuth,

        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    blogController.create,
  );

  app.delete<{
    Params: {
      id: string;
    };
  }>(
    "/admin/blog/posts/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    blogController.delete,
  );
}
