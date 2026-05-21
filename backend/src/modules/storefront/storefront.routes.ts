import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  createAdminHeroSlideController,
  deleteAdminHeroSlideController,
  getAdminBannersController,
  getAdminHeroSlidesController,
  getAdminThemeController,
  getPublicBannersController,
  getPublicHeroSlidesController,
  getPublicThemeController,
  updateAdminBannerController,
  updateAdminHeroSlideController,
  updateAdminThemeController,
} from "./storefront.controller.js";
import type {
  CreateStorefrontHeroSlideBody,
  StorefrontBannerIdParams,
  StorefrontHeroSlideIdParams,
  UpdateStorefrontBannerBody,
  UpdateStorefrontHeroSlideBody,
  UpdateStorefrontThemeBody,
} from "./storefront.schemas.js";

export async function storefrontRoutes(app: FastifyInstance) {
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
  app.get("/storefront/banners", getPublicBannersController);
  app.get("/storefront/hero-slides", getPublicHeroSlidesController);
  app.get(
    "/admin/storefront/banners",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminBannersController,
  );
  app.get("/storefront/theme", getPublicThemeController);

  app.patch<{
    Params: StorefrontBannerIdParams;
    Body: UpdateStorefrontBannerBody;
  }>(
    "/admin/storefront/banners/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateAdminBannerController,
  );
  app.get(
    "/admin/storefront/theme",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminThemeController,
  );

  app.patch<{
    Body: UpdateStorefrontThemeBody;
  }>(
    "/admin/storefront/theme",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateAdminThemeController,
  );
}
