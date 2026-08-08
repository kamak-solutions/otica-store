import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  getPublicLandingPageController,
  listLandingPagesController,
  getLandingPageByIdController,
  createLandingPageController,
  updateLandingPageController,
  deleteLandingPageController,
} from "./landing-page.controller.js";
import type {
  LandingPageParams,
  CreateLandingPageBody,
  UpdateLandingPageBody,
} from "./landing-page.schema.js";

export async function landingPageRoutes(app: FastifyInstance) {
  // Rota pública
  app.get<{ Params: { slug: string } }>(
    "/:slug",
    getPublicLandingPageController,
  );
  app.get<{ Params: LandingPageParams }>(
    "/admin/landing-pages/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getLandingPageByIdController,
  );

  // Rotas administrativas com middlewares
  app.get(
    "/admin/landing-pages",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    listLandingPagesController,
  );

  app.post<{ Body: CreateLandingPageBody }>(
    "/admin/landing-pages",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createLandingPageController,
  );

  app.put<{ Params: LandingPageParams; Body: UpdateLandingPageBody }>(
    "/admin/landing-pages/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateLandingPageController,
  );

  app.delete<{ Params: LandingPageParams }>(
    "/admin/landing-pages/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    deleteLandingPageController,
  );
}
