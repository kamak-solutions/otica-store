import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  createAdminHeroSlideController,
  deleteAdminHeroSlideController,
  getAdminHeroSlidesController,
  getPublicHeroSlidesController,
  updateAdminHeroSlideController,
} from "./storefront.controller.js";
import type {
  CreateStorefrontHeroSlideBody,
  StorefrontHeroSlideIdParams,
  UpdateStorefrontHeroSlideBody,
} from "./storefront.schemas.js";

export async function storefrontRoutes(app: FastifyInstance) {
  app.get("/storefront/hero-slides", getPublicHeroSlidesController);

  app.get(
    "/admin/storefront/hero-slides",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminHeroSlidesController,
  );
  app.post<{
    Body: CreateStorefrontHeroSlideBody;
  }>(
    "/admin/storefront/hero-slides",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createAdminHeroSlideController,
  );
  app.patch<{
    Params: StorefrontHeroSlideIdParams;
    Body: UpdateStorefrontHeroSlideBody;
  }>(
    "/admin/storefront/hero-slides/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateAdminHeroSlideController,
  );
  app.delete<{
    Params: StorefrontHeroSlideIdParams;
  }>(
    "/admin/storefront/hero-slides/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    deleteAdminHeroSlideController,
  );
}
