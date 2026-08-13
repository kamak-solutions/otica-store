import type { FastifyInstance } from "fastify";
import {
  uploadPrescriptionController,
  uploadProductImageController,
  uploadStorefrontImageController,
  uploadCampaignImageController,
  uploadBlogImageController,
  uploadLandingPageImageController,
} from "./uploads.controller.js";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post(
    "/uploads/prescription",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "15 minutes",
        },
      },
    },
    uploadPrescriptionController,
  );
  app.post(
    "/uploads/product-image",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    uploadProductImageController,
  );
  app.post(
    "/admin/storefront/upload-image",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    uploadStorefrontImageController,
  );
  app.post(
    "/admin/campaigns/upload-image",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },

    uploadCampaignImageController,
  );
  app.post(
    "/admin/blog/upload-image",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    uploadBlogImageController,
  );
  app.post(
    "/admin/landing-pages/upload-image",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    uploadLandingPageImageController,
  );
}
