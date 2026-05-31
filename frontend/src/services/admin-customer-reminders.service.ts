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

export type CustomerReminder = {
  id: string;
  customerId: string;
  type: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type Response = {
  data: CustomerReminder[];
};

export function getCustomerReminders(customerId: string) {
  return apiFetch<Response>(`/admin/customers/${customerId}/reminders`, {
    headers: getAdminAuthHeaders(),
  });
}
type CreateReminderBody = {
  type: string;
  title: string;
  dueDate: string;
};

export function createCustomerReminder(
  customerId: string,
  body: CreateReminderBody,
) {
  return apiFetch(`/admin/customers/${customerId}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
}

export function completeCustomerReminder(reminderId: string) {
  return apiFetch(`/admin/reminders/${reminderId}/complete`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
  });
}
