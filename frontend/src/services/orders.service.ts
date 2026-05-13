import { apiFetch } from "./api";

export type CreateOrderItemPayload = {
  productId: string;
  quantity: number;
};

export type CreateOrderCustomerPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  birthDate: string;
  lgpdAccepted: boolean;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  notes?: string;
};

export type CreateOrderPayload = {
  customer: CreateOrderCustomerPayload;
  items: CreateOrderItemPayload[];
};

export type CreateOrderResponse = {
  data: {
    id: string;
    orderNumber: string | null;
    status: string;
    notes: string | null;
    createdAt: string;
  };
  message: string;
};

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
