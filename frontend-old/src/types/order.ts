export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

export type OrderCustomer = {
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

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string | null;
  status: OrderStatus;
  subtotal: string;
  notes: string | null;
  customer: OrderCustomer;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
