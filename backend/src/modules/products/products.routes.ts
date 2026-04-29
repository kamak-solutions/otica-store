import type { FastifyInstance } from "fastify";
import {
  createProductController,
  getProductBySlugController,
  deleteProductController,
  getProductsController,
  getAdminProductsController,
  updateProductController,
} from "./products.controller.js";

export async function productsRoutes(app: FastifyInstance) {
  app.get("/products", getProductsController);
  app.get("/products/:slug", getProductBySlugController);

  app.post("/admin/products", createProductController);
  app.put("/admin/products/:id", updateProductController);
  app.get("/admin/products", getAdminProductsController);

  app.delete("/admin/products/:id", deleteProductController);
}