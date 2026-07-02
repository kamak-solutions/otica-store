import type { FastifyInstance } from "fastify";

import {
  createBrandController,
  deleteBrandController,
  getBrandsController,
  updateBrandController,
} from "./brands.controller.js";

export async function brandsRoutes(app: FastifyInstance) {
  app.get("/brands", getBrandsController);

  app.post("/admin/brands", createBrandController);

  app.put("/admin/brands/:id", updateBrandController);

  app.delete("/admin/brands/:id", deleteBrandController);
}