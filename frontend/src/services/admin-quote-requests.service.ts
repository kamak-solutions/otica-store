import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

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

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function listAdminQuoteRequests() {
  return apiFetch<ListAdminQuoteRequestsResponse>("/admin/quote-requests", {
    headers: getAdminAuthHeaders(),
  });
}

export function updateAdminQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus,
) {
  return apiFetch<UpdateAdminQuoteRequestStatusResponse>(
    `/admin/quote-requests/${id}/status`,
    {
      method: "PATCH",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status }),
    },
  );
}
