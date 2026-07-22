import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type { CreatePrescriptionBody } from "./prescriptions.schemas.js";

type CreatePrescriptionData = CreatePrescriptionBody & {
  customerId: string;
};

export async function listPrescriptionsByCustomerId(
  customerId: string,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new AppError(
      "Cliente não encontrado.",
      404,
      "Not found",
    );
  }

  return prisma.opticalPrescription.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPrescription(
  data: CreatePrescriptionData,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: data.customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new AppError(
      "Cliente não encontrado.",
      404,
      "Not found",
    );
  }

  return prisma.opticalPrescription.create({
    data: {
      customerId: data.customerId,

      examDate: data.examDate
        ? new Date(`${data.examDate}T00:00:00.000Z`)
        : null,

      expiresAt: data.expiresAt
        ? new Date(`${data.expiresAt}T00:00:00.000Z`)
        : null,

      rightSpherical: data.rightSpherical ?? null,
      rightCylindrical: data.rightCylindrical ?? null,
      rightAxis: data.rightAxis ?? null,

      leftSpherical: data.leftSpherical ?? null,
      leftCylindrical: data.leftCylindrical ?? null,
      leftAxis: data.leftAxis ?? null,

      addition: data.addition ?? null,
      pupillaryDistance: data.pupillaryDistance ?? null,
      height: data.height ?? null,

      doctorName: data.doctorName ?? null,
      doctorCrm: data.doctorCrm ?? null,

      notes: data.notes ?? null,
    },
  });
}