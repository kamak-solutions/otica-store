type OrderHttp = {
  id: string;
  orderNumber: string | null;
  status: string;
  subtotal: {
    toFixed: (digits: number) => string;
  };
  notes: string | null;
  customer: {
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
  items: {
    id: string;
    productId: string;
    productName: string;
    unitPrice: {
      toFixed: (digits: number) => string;
    };
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export function mapOrderToHttp(order: OrderHttp) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal.toFixed(2),
    notes: order.notes,
    customer: {
      id: order.customer.id,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      zipcode: order.customer.zipcode,
      state: order.customer.state,
      street: order.customer.street,
      number: order.customer.number,
      complement: order.customer.complement,
      district: order.customer.district,
      city: order.customer.city,
    },
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice.toFixed(2),
      quantity: item.quantity,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}