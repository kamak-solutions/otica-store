import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type AdminUserRole = "owner" | "admin" | "collaborator" | "viewer";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminUserPayload = {
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
};

type ListAdminUsersResponse = {
  data: AdminUser[];
};

type AdminUserResponse = {
  data: AdminUser;
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

export function listAdminUsers() {
  return apiFetch<ListAdminUsersResponse>("/admin/users", {
    headers: getAdminAuthHeaders(),
  });
}

export function createAdminUser(payload: CreateAdminUserPayload) {
  return apiFetch<AdminUserResponse>("/admin/users", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateAdminUserRole(id: string, role: AdminUserRole) {
  return apiFetch<AdminUserResponse>(`/admin/users/${id}/role`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ role }),
  });
}

export function updateAdminUserActive(id: string, active: boolean) {
  return apiFetch<AdminUserResponse>(`/admin/users/${id}/active`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ active }),
  });
}
