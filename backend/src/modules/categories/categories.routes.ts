import type { FastifyInstance } from "fastify";

import {
  createCategoryController,
  getCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "./categories.controller.js";

export async function categoriesRoutes(app: FastifyInstance) {
  app.get("/categories", getCategoriesController);

  app.post("/admin/categories", createCategoryController);

  app.put("/admin/categories/:id", updateCategoryController);
  app.delete("/admin/categories/:id", deleteCategoryController);
}
