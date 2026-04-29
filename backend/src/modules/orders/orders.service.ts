import { prisma } from "../../lib/prisma.js";
import type {
  CreateOrderBody,
  OrderStatus,
} from "./orders.schemas.js";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);

  return `OSR-${timestamp}`;
}

export async function createOrder(data: CreateOrderBody) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        name: data.customer.customerName,
        email: data.customer.customerEmail,
        phone: data.customer.customerPhone,
        zipcode: data.customer.zipcode,
        state: data.customer.state,
        street: data.customer.street,
        number: data.customer.number,
        complement: data.customer.complement || null,
        district: data.customer.district,
        city: data.customer.city,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        subtotal: data.subtotal,
        notes: data.customer.notes || null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return order;
  });
}

export async function listAdminOrders() {
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: true,
    },
  });
}

export async function findAdminOrderById(id: string) {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: true,
    },
  });
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      customer: true,
      items: true,
    },
  });
}