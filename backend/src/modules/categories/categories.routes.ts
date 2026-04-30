import type { FastifyInstance } from "fastify";
import { getCategoriesController } from "./categories.controller.js";

export async function categoriesRoutes(app: FastifyInstance) {
  app.get("/categories", getCategoriesController);
}
