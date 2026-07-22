import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";

export async function listAttendances() {
  return prisma.customerAttendance.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      createdByAdmin: true,
    },
  });
}

type CreateAttendanceData = {
  customerId: string;
  createdByAdminId?: string;

  prescriptionId?: string;

  type: string;

  notes?: string;
};

export async function createAttendance(data: CreateAttendanceData) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: data.customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new AppError("Cliente não encontrado.", 404, "Not found");
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

    if (prescription.customerId !== data.customerId) {
      throw new AppError(
        "A receita não pertence ao cliente informado.",
        409,
        "Conflict",
      );
    }
  }

  return prisma.customerAttendance.create({
    data,
    include: {
      customer: true,
      createdByAdmin: true,
      prescription: true,
      orders: true,
    },
  });
}

export async function findAttendanceById(id: string) {
  return prisma.customerAttendance.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      createdByAdmin: true,
      prescription: true,
      orders: true,
    },
  });
}
export async function listAttendancesByCustomerId(customerId: string) {
  return prisma.customerAttendance.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      createdByAdmin: true,
      orders: true,
    },
  });
}
