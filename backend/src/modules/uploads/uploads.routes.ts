import type { FastifyInstance } from "fastify";
import {
  uploadPrescriptionController,
  uploadProductImageController,
  uploadStorefrontImageController,
  uploadCampaignImageController,
  uploadBlogImageController,
} from "./uploads.controller.js";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post("/uploads/prescription", uploadPrescriptionController);
  app.post("/uploads/product-image", uploadProductImageController);
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
}
