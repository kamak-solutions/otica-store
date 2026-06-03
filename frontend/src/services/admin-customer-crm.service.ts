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

export function updateCustomerCrmStatus(
  customerId: string,
  crmStatus: string,
) {
  return apiFetch(
    `/admin/customers/${customerId}/crm-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({
        crmStatus,
      }),
    },
  );
}