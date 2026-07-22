import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createProductCollectionController,
  deleteProductCollectionController,
  getProductCollectionByIdController,
  getProductCollectionsController,
  updateProductCollectionController,
} from "./product-collections.controller.js";

import type {
  CreateProductCollectionBody,
  ProductCollectionIdParams,
  UpdateProductCollectionBody,
} from "./product-collections.schemas.js";

export async function productCollectionsRoutes(app: FastifyInstance) {
  app.get(
    "/admin/product-collections",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getProductCollectionsController,
  );

  app.get<{
    Params: ProductCollectionIdParams;
  }>(
    "/admin/product-collections/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getProductCollectionByIdController,
  );

  app.post<{
    Body: CreateProductCollectionBody;
  }>(
    "/admin/product-collections",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    createProductCollectionController,
  );

  app.put<{
    Params: ProductCollectionIdParams;
    Body: UpdateProductCollectionBody;
  }>(
    "/admin/product-collections/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    updateProductCollectionController,
  );

  app.delete<{
    Params: ProductCollectionIdParams;
  }>(
    "/admin/product-collections/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner"]),
      ],
    },
    deleteProductCollectionController,
  );
}