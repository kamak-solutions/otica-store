import type { FastifyInstance } from "fastify";
import {
  createProductController,
  deleteProductController,
  getAdminProductsController,
  updateProductController,
} from "./products.controller.js";

export async function productsAdminRoutes(app: FastifyInstance) {
  app.get("/admin/products", getAdminProductsController);
  app.post("/admin/products", createProductController);
  app.put("/admin/products/:id", updateProductController);
  app.delete("/admin/products/:id", deleteProductController);
}