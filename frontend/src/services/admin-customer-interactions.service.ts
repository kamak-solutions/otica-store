import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(
    ADMIN_TOKEN_STORAGE_KEY,
  );

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type CustomerInteraction = {
  id: string;
  customerId: string;
  type: string;
  description: string;
  createdAt: string;
};

type Response = {
  data: CustomerInteraction[];
};

export function getCustomerInteractions(
  customerId: string,
) {
  return apiFetch<Response>(
    `/admin/customers/${customerId}/interactions`,
    {
      headers: getAdminAuthHeaders(),
    },
  );
}

type CreateInteractionBody = {
  type: string;
  description: string;
};

export function createCustomerInteraction(
  customerId: string,
  body: CreateInteractionBody,
) {
  return apiFetch(
    `/admin/customers/${customerId}/interactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify(body),
    },
  );
}