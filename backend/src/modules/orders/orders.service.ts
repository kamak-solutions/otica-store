import { prisma } from "../../lib/prisma.js";
import type { CreateOrderBody, OrderStatus } from "./orders.schemas.js";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);

  return `OSR-${timestamp}`;
}

export async function createOrder(data: CreateOrderBody) {
  return prisma.$transaction(async (tx) => {
    const productIds = data.items.map((item) => item.productId);

    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        active: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("Um ou mais produtos do pedido não foram encontrados.");
    }

    const orderItems = data.items.map((item) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === item.productId,
      );

      if (!product) {
        throw new Error("Produto não encontrado no pedido.");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}.`);
      }

      const unitPrice = product.salePrice ?? product.price;

      return {
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce((total, item) => {
      return total + Number(item.unitPrice) * item.quantity;
    }, 0);

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
        subtotal,
        notes: data.customer.notes || null,
        items: {
          create: orderItems,
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
