import type { FastifyInstance } from "fastify";
import { uploadPrescriptionController } from "./uploads.controller.js";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post("/uploads/prescription", uploadPrescriptionController);
}