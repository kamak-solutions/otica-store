import { prisma } from "../../lib/prisma.js";
import type { CreateQuoteRequestBody } from "./quote-requests.schemas.js";

export async function createQuoteRequest(data: CreateQuoteRequestBody) {
  return prisma.quoteRequest.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone,

      requestType: data.requestType,
      prescriptionText: data.prescriptionText || null,
      notes: data.notes || null,

      prescriptionFileUrl: data.prescriptionFileUrl || null,
      prescriptionPublicId: data.prescriptionPublicId || null,

      status: "pending",
    },
  });
}