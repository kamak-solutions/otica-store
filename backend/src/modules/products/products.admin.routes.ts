import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  addProductImageController,
  createProductController,
  deleteProductController,
  getAdminProductByIdController,
  getAdminProductsController,
  updateProductController,
  removeProductImageController,
  setProductImageAsMainController,
} from "./products.controller.js";
import type {
  CreateProductBody,
  CreateProductImageBody,
  ProductIdParams,
  UpdateProductBody,
  ProductImageParams,
} from "./products.schemas.js";

export async function productsAdminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/products",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminProductsController,
  );

  app.post<{
    Body: CreateProductBody;
  }>(
    "/admin/products",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    createProductController,
  );

  app.get<{
    Params: ProductIdParams;
  }>(
    "/admin/products/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminProductByIdController,
  );

  app.put<{
    Params: ProductIdParams;
    Body: UpdateProductBody;
  }>(
    "/admin/products/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    updateProductController,
  );

  app.delete<{
    Params: ProductIdParams;
  }>(
    "/admin/products/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    deleteProductController,
  );

  app.post<{
    Params: ProductIdParams;
    Body: CreateProductImageBody;
  }>(
    "/admin/products/:id/images",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    addProductImageController,
  );
  app.patch<{
    Params: ProductImageParams;
  }>(
    "/admin/products/:productId/images/:imageId/main",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    setProductImageAsMainController,
  );

  app.delete<{
    Params: ProductImageParams;
  }>(
    "/admin/products/:productId/images/:imageId",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    removeProductImageController,
  );
}
