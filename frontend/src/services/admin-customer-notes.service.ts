import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type CustomerNote = {
  id: string;
  note: string;
  createdAt: string;
};

type Response = {
  data: CustomerNote[];
};

export function getCustomerNotes(customerId: string) {
  return apiFetch<Response>(`/admin/customers/${customerId}/notes`, {
    headers: getAdminAuthHeaders(),
  });
}
type CreateCustomerNoteBody = {
  note: string;
};

export function createCustomerNote(
  customerId: string,
  body: CreateCustomerNoteBody,
) {
  return apiFetch(`/admin/customers/${customerId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
}
