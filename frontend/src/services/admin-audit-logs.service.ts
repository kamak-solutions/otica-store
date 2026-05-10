import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type AdminAuditLog = {
  id: string;
  adminId: string | null;
  adminEmail: string | null;
  adminRole: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  createdAt: string;
};

type ListAdminAuditLogsResponse = {
  data: AdminAuditLog[];
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

export function listAdminAuditLogs() {
  return apiFetch<ListAdminAuditLogsResponse>("/admin/audit-logs", {
    headers: getAdminAuthHeaders(),
  });
}
