import { apiFetch } from "./api";

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

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}