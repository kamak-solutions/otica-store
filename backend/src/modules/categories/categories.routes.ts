import type { FastifyInstance } from "fastify";

import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
} from "./categories.controller.js";

export async function categoriesRoutes(app: FastifyInstance) {
  app.get("/categories", getCategoriesController);

  app.post("/admin/categories", createCategoryController);

  app.put("/admin/categories/:id", updateCategoryController);
}