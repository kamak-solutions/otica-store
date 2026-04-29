import type { FastifyInstance } from "fastify";
import { requireAdminAuth } from "../admin-auth/admin-auth.middleware.js";
import {
  addProductImageController,
  createProductController,
  deleteProductController,
  getAdminProductsController,
  updateProductController,
} from "./products.controller.js";
import type {
  CreateProductBody,
  CreateProductImageBody,
  ProductIdParams,
  UpdateProductBody,
} from "./products.schemas.js";

export async function productsAdminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/products",
    { preHandler: requireAdminAuth },
    getAdminProductsController,
  );

  app.post<{
    Body: CreateProductBody;
  }>(
    "/admin/products",
    { preHandler: requireAdminAuth },
    createProductController,
  );

  app.put<{
    Params: ProductIdParams;
    Body: UpdateProductBody;
  }>(
    "/admin/products/:id",
    { preHandler: requireAdminAuth },
    updateProductController,
  );

  app.delete<{
    Params: ProductIdParams;
  }>(
    "/admin/products/:id",
    { preHandler: requireAdminAuth },
    deleteProductController,
  );

  app.post<{
    Params: ProductIdParams;
    Body: CreateProductImageBody;
  }>(
    "/admin/products/:id/images",
    { preHandler: requireAdminAuth },
    addProductImageController,
  );
}