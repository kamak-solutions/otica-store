import { apiFetch } from "./api";

export type CreateQuoteRequestPayload = {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  requestType: string;
  prescriptionText?: string;
  notes?: string;
  prescriptionFileUrl?: string;
  prescriptionPublicId?: string;
};

export type CreateQuoteRequestResponse = {
  data: {
    id: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    requestType: string;
    prescriptionText: string | null;
    notes: string | null;
    prescriptionFileUrl: string | null;
    prescriptionPublicId: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
};

export function createQuoteRequest(payload: CreateQuoteRequestPayload) {
  return apiFetch<CreateQuoteRequestResponse>("/quote-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
