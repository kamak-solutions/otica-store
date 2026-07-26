import { prisma } from "../../lib/prisma.js";
import type { CreateOrderBody, OrderStatus } from "./orders.schemas.js";
import { AppError } from "../../errors/app-error.js";
import { createMercadoPagoPreference } from "../payments/mercado-pago.service.js";
import {
  isAdult,
  isValidCpf,
  normalizeCpf,
} from "../../utils/customer-validation.js";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);

  return `OSR-${timestamp}`;
}
export type CreateAdminOrderInput = {
  customerId: string;
  attendanceId?: string;
  createdByAdminId?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export async function createOrder(data: CreateOrderBody) {
  return prisma.$transaction(async (tx) => {
    const normalizedCpf = normalizeCpf(data.customer.customerCpf);

    if (!isValidCpf(normalizedCpf)) {
      throw new AppError("CPF inválido.", 400, "Bad Request");
    }

    const birthDate = new Date(`${data.customer.birthDate}T00:00:00`);

    if (Number.isNaN(birthDate.getTime())) {
      throw new AppError("Data de nascimento inválida.", 400, "Bad Request");
    }

    if (!isAdult(birthDate)) {
      throw new AppError(
        "Cliente precisa ser maior de idade para finalizar o pedido.",
        400,
        "Bad Request",
      );
    }
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
        cpf: normalizedCpf,
        birthDate,
        zipcode: data.customer.zipcode,
        state: data.customer.state,
        street: data.customer.street,
        number: data.customer.number,
        complement: data.customer.complement || null,
        district: data.customer.district,
        city: data.customer.city,
        lgpdAcceptedAt: new Date(),
        lgpdConsentSource: "checkout",
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
export async function createAdminOrder(data: CreateAdminOrderInput) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado.", 404, "Not found");
    }
    if (data.attendanceId) {
      const attendance = await tx.customerAttendance.findUnique({
        where: {
          id: data.attendanceId,
        },
        select: {
          id: true,
          customerId: true,
          status: true,
          prescriptionId: true,
        },
      });

      if (!attendance) {
        throw new AppError("Atendimento não encontrado.", 404, "Not found");
      }

      if (attendance.customerId !== data.customerId) {
        throw new AppError(
          "O atendimento não pertence ao cliente informado.",
          409,
          "Conflict",
        );
      }

      if (attendance.status === "converted_to_order") {
        throw new AppError(
          "Este atendimento já foi convertido em pedido.",
          409,
          "Conflict",
        );
      }

      if (attendance.status === "cancelled") {
        throw new AppError(
          "Não é possível criar pedido a partir de um atendimento cancelado.",
          409,
          "Conflict",
        );
      }
    }

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
      throw new AppError(
        "Um ou mais produtos do pedido não foram encontrados.",
        400,
        "Bad Request",
      );
    }

    const orderItems = data.items.map((item) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === item.productId,
      );

      if (!product) {
        throw new AppError(
          "Produto não encontrado no pedido.",
          400,
          "Bad Request",
        );
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Estoque insuficiente para o produto ${product.name}.`,
          400,
          "Bad Request",
        );
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

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        attendanceId: data.attendanceId ?? null,
        createdByAdminId: data.createdByAdminId ?? null,
        subtotal,
        notes: data.notes || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });
    if (data.attendanceId) {
      await tx.customerAttendance.update({
        where: {
          id: data.attendanceId,
        },
        data: {
          status: "converted_to_order",
        },
      });
    }

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
export const allowedOrderStatusTransitions: Record<OrderStatus, OrderStatus[]> =
  {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };

export function isOrderStatusTransitionAllowed(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
) {
  return allowedOrderStatusTransitions[currentStatus].includes(nextStatus);
}
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
    },
  });

  if (!order) {
    throw new AppError("Pedido não encontrado.", 404, "Not found");
  }

  const currentStatus = order.status as OrderStatus;

  if (!isOrderStatusTransitionAllowed(currentStatus, status)) {
    throw new AppError(
      `Não é possível alterar o pedido de "${currentStatus}" para "${status}".`,
      409,
      "Conflict",
    );
  }

  if (status === "delivered" && order.paymentStatus !== "paid") {
    throw new AppError(
      "Não é possível marcar o pedido como entregue enquanto o pagamento não estiver confirmado.",
      409,
      "Conflict",
    );
  }

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
export async function createOrderPaymentLink(id: string) {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    throw new AppError("Pedido não encontrado.", 404, "Not found");
  }

  if (order.paymentStatus === "paid") {
    throw new AppError("Este pedido já está pago.", 400, "Bad Request");
  }

  const preference = await createMercadoPagoPreference({
    orderId: order.id,
    orderNumber: order.orderNumber ?? order.id,
    customerEmail: order.customer.email,
    items: order.items.map((item) => ({
      title: item.productName,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: "BRL",
    })),
  });

  return prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      paymentStatus: "waiting_payment",
      paymentMethod: "checkout_pro",
      paymentProvider: "mercado_pago",
      paymentProviderId: preference.providerId,
      paymentUrl: preference.paymentUrl,
    },
    include: {
      customer: true,
      items: true,
    },
  });
}
