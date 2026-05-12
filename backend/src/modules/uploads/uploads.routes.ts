import type { FastifyInstance } from "fastify";
import {
  uploadPrescriptionController,
  uploadProductImageController,
} from "./uploads.controller.js";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post("/uploads/prescription", uploadPrescriptionController);
  app.post("/uploads/product-image", uploadProductImageController);
}