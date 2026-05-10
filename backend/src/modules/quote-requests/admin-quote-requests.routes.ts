import type { FastifyInstance } from "fastify";
import {
  listAdminQuoteRequestsController,
  updateAdminQuoteRequestStatusController,
} from "./admin-quote-requests.controller.js";

export async function adminQuoteRequestRoutes(app: FastifyInstance) {
  app.get("/admin/quote-requests", listAdminQuoteRequestsController);

  app.patch(
    "/admin/quote-requests/:id/status",
    updateAdminQuoteRequestStatusController,
  );
}