import { apiFetch } from "./api";

export type QuoteRequestStatus =
  | "pending"
  | "in_analysis"
  | "quoted"
  | "converted"
  | "cancelled";

export type AdminQuoteRequest = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  requestType: string;
  prescriptionText: string | null;
  notes: string | null;
  prescriptionFileUrl: string | null;
  prescriptionPublicId: string | null;
  status: QuoteRequestStatus;
  createdAt: string;
  updatedAt: string;
};

type ListAdminQuoteRequestsResponse = {
  data: AdminQuoteRequest[];
};

type UpdateAdminQuoteRequestStatusResponse = {
  data: AdminQuoteRequest;
  message: string;
};

export function listAdminQuoteRequests() {
  return apiFetch<ListAdminQuoteRequestsResponse>("/admin/quote-requests");
}

export function updateAdminQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus,
) {
  return apiFetch<UpdateAdminQuoteRequestStatusResponse>(
    `/admin/quote-requests/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
