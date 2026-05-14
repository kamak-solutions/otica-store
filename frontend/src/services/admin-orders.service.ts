import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type AdminOrderCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
};

export type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  subtotal: string;
  notes: string | null;
  customer: AdminOrderCustomer;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt: string;
};

type ListAdminOrdersResponse = {
  data: AdminOrder[];
};

type GetAdminOrderResponse = {
  data: AdminOrder;
};

type UpdateAdminOrderStatusResponse = {
  data: AdminOrder;
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

export function listAdminOrders() {
  return apiFetch<ListAdminOrdersResponse>("/admin/orders", {
    headers: getAdminAuthHeaders(),
  });
}

export function getAdminOrderById(id: string) {
  return apiFetch<GetAdminOrderResponse>(`/admin/orders/${id}`, {
    headers: getAdminAuthHeaders(),
  });
}

export function updateAdminOrderStatus(id: string, status: OrderStatus) {
  return apiFetch<UpdateAdminOrderStatusResponse>(
    `/admin/orders/${id}/status`,
    {
      method: "PATCH",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status }),
    },
  );
}

