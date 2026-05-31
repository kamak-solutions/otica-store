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

export type CrmDashboard = {
  remindersPending: number;
  remindersOverdue: number;
  totalCustomers: number;
  interactionsLast30Days: number;
};

type Response = {
  data: CrmDashboard;
};

export function getCrmDashboard() {
  return apiFetch<Response>(
    "/admin/crm/dashboard",
    {
      headers: getAdminAuthHeaders(),
    },
  );
}