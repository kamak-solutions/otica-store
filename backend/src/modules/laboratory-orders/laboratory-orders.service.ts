import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  CreateLaboratoryOrderBody,
  LaboratoryOrderStatus,
  UpdateLaboratoryOrderStatusBody,
} from "./laboratory-orders.schemas.js";

const laboratoryOrderInclude = {
  order: {
    include: {
      customer: true,
      items: true,
    },
  },

  laboratory: true,
  prescription: true,
  createdByAdmin: true,
};

export async function listLaboratoryOrders() {
  return prisma.laboratoryOrder.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: laboratoryOrderInclude,
  });
}

export async function findLaboratoryOrderById(id: string) {
  return prisma.laboratoryOrder.findUnique({
    where: {
      id,
    },
    include: laboratoryOrderInclude,
  });
}

export async function createLaboratoryOrder(
  data: CreateLaboratoryOrderBody & {
    createdByAdminId?: string;
  },
) {
  const order = await prisma.order.findUnique({
    where: {
      id: data.orderId,
    },
    include: {
      attendance: true,
    },
  });

  if (!order) {
    throw new AppError("Pedido não encontrado.", 404, "Not found");
  }

  const laboratory = await prisma.laboratory.findUnique({
    where: {
      id: data.laboratoryId,
    },
    select: {
      id: true,
      active: true,
      averageDeliveryDays: true,
    },
  });

  if (!laboratory) {
    throw new AppError("Laboratório não encontrado.", 404, "Not found");
  }

  if (!laboratory.active) {
    throw new AppError(
      "Não é possível utilizar um laboratório inativo.",
      409,
      "Conflict",
    );
  }

  if (data.prescriptionId) {
    const prescription = await prisma.opticalPrescription.findUnique({
      where: {
        id: data.prescriptionId,
      },
      select: {
        id: true,
        customerId: true,
      },
    });

    if (!prescription) {
      throw new AppError("Receita não encontrada.", 404, "Not found");
    }

    if (prescription.customerId !== order.customerId) {
      throw new AppError(
        "A receita não pertence ao cliente do pedido.",
        409,
        "Conflict",
      );
    }
  }

  const existingLaboratoryOrder = await prisma.laboratoryOrder.findFirst({
    where: {
      orderId: data.orderId,
      laboratoryId: data.laboratoryId,
      status: {
        not: "delivered",
      },
    },
    select: {
      id: true,
    },
  });

  if (existingLaboratoryOrder) {
    throw new AppError(
      "Já existe um pedido ativo para este laboratório.",
      409,
      "Conflict",
    );
  }

  let expectedAt = data.expectedAt;

  if (!expectedAt && laboratory.averageDeliveryDays) {
    expectedAt = new Date();

    expectedAt.setDate(expectedAt.getDate() + laboratory.averageDeliveryDays);
  }

  return prisma.laboratoryOrder.create({
    data: {
      orderId: data.orderId,
      laboratoryId: data.laboratoryId,
      prescriptionId: data.prescriptionId ?? null,

      externalOrderNumber: data.externalOrderNumber ?? null,

      expectedAt: expectedAt ?? null,
      notes: data.notes ?? null,

      createdByAdminId: data.createdByAdminId ?? null,
    },

    include: laboratoryOrderInclude,
  });
}
export const allowedLaboratoryOrderTransitions: Record<
  LaboratoryOrderStatus,
  LaboratoryOrderStatus[]
> = {
  pending: ["sent"],
  sent: ["received_by_laboratory"],
  received_by_laboratory: ["in_production"],
  in_production: ["ready"],
  ready: ["received_at_store"],
  received_at_store: ["mounted"],
  mounted: ["delivered"],
  delivered: [],
};

export function isLaboratoryOrderTransitionAllowed(
  currentStatus: LaboratoryOrderStatus,
  nextStatus: LaboratoryOrderStatus,
) {
  return allowedLaboratoryOrderTransitions[currentStatus].includes(nextStatus);
}

function buildStatusDates(status: LaboratoryOrderStatus) {
  const now = new Date();

  switch (status) {
    case "sent":
      return {
        sentAt: now,
      };

    case "received_at_store":
      return {
        receivedAt: now,
      };

    case "delivered":
      return {
        deliveredAt: now,
      };

    default:
      return {};
  }
}

export function mapLaboratoryStatusToOrderStatus(status: LaboratoryOrderStatus) {
  switch (status) {
    case "pending":
      return "pending";

    case "sent":
    case "received_by_laboratory":
      return "confirmed";

    case "in_production":
    case "ready":
    case "received_at_store":
    case "mounted":
    case "delivered":
      return "preparing";
  }
}

export async function updateLaboratoryOrderStatus(
  id: string,
  data: UpdateLaboratoryOrderStatusBody,
) {
  const laboratoryOrder = await findLaboratoryOrderById(id);

  if (!laboratoryOrder) {
    throw new AppError("Pedido laboratorial não encontrado.", 404, "Not found");
  }

  const currentStatus = laboratoryOrder.status as LaboratoryOrderStatus;

  if (!isLaboratoryOrderTransitionAllowed(currentStatus, data.status)) {
    throw new AppError(
      `Não é possível alterar o pedido laboratorial de "${currentStatus}" para "${data.status}".`,
      409,
      "Conflict",
    );
  }

  const statusDates = buildStatusDates(data.status);

  const orderStatus = mapLaboratoryStatusToOrderStatus(data.status);

  return prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: laboratoryOrder.orderId,
      },
      data: {
        status: orderStatus,
      },
    });

    return tx.laboratoryOrder.update({
      where: {
        id,
      },

      data: {
        status: data.status,

        ...(data.externalOrderNumber !== undefined && {
          externalOrderNumber: data.externalOrderNumber ?? null,
        }),

        ...(data.expectedAt !== undefined && {
          expectedAt: data.expectedAt,
        }),

        ...(data.notes !== undefined && {
          notes: data.notes ?? null,
        }),

        ...statusDates,
      },

      include: laboratoryOrderInclude,
    });
  });
}
