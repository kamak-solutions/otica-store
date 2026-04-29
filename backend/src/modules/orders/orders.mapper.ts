import type { createOrder } from "./orders.service.js";

type OrderWithRelations = Awaited<ReturnType<typeof createOrder>>;

export function mapOrderToHttp(order: OrderWithRelations) {
  return {
    id: order.id,
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