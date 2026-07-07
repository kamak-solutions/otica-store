import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type Attendance = {
  id: string;
  type: string;
  status: string;
  notes: string | null;
  customer: {
    id: string;
    name: string;
  };
  collaborator: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  orders: Array<{
    id: string;
    orderNumber: string | null;
    status: string;
    subtotal: string;
    createdAt: string;
  }>;
};

type CreateAttendanceInput = {
  customerId: string;
  type: string;
  notes?: string;
};

type AttendanceResponse = {
  data: Attendance;
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

export function createAttendance(data: CreateAttendanceInput) {
  return apiFetch<AttendanceResponse>("/admin/attendances", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data),
  });
}
type ListAttendancesResponse = {
  data: Attendance[];
};

export function listCustomerAttendances(customerId: string) {
  return apiFetch<ListAttendancesResponse>(
    `/admin/customers/${customerId}/attendances`,
    {
      headers: getAdminAuthHeaders(),
    },
  );
}
