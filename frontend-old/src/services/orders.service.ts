import { apiFetch } from "./api";
import type { Order, OrderStatus } from "../types/order";

type CreateOrderPayload = {
  customer: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    zipcode: string;
    state: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    notes?: string;
  };
  items: {
    productId: string;
    productName: string;
    unitPrice: string;
    quantity: number;
  }[];
  subtotal: number;
};

type CreateOrderResponse = {
  data: {
    id: string;
    orderNumber: string | null;
    status: string;
    subtotal: string;
    createdAt: string;
  };
  message: string;
};

type AdminOrdersResponse = {
  data: Order[];
};

type UpdateOrderStatusResponse = {
  data: Order;
  message: string;
};

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAdminOrders() {
  return apiFetch<AdminOrdersResponse>("/admin/orders");
}

export function getAdminOrderById(orderId: string) {
  return apiFetch<{ data: Order }>(`/admin/orders/${orderId}`);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return apiFetch<UpdateOrderStatusResponse>(
    `/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}