import type { FastifyInstance } from "fastify";
import {
  createProductController,
  getProductBySlugController,
  deleteProductController,
  getProductsController,
  updateProductController,
} from "./products.controller.js";

export async function productsRoutes(app: FastifyInstance) {
  app.get("/products", getProductsController);
  app.get("/products/:slug", getProductBySlugController);

  app.post("/admin/products", createProductController);
  app.put("/admin/products/:id", updateProductController);

  app.delete("/admin/products/:id", deleteProductController);
}