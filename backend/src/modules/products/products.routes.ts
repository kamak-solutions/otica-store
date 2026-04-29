import type { FastifyInstance } from "fastify";
import { productsAdminRoutes } from "./products.admin.routes.js";
import { productsPublicRoutes } from "./products.public.routes.js";

export async function productsRoutes(app: FastifyInstance) {
  app.register(productsPublicRoutes);
  app.register(productsAdminRoutes);
}