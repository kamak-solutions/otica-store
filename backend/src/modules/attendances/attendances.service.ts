import { prisma } from "../../lib/prisma.js";

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

  type: string;

  notes?: string;
};

export async function createAttendance(data: CreateAttendanceData) {
  return prisma.customerAttendance.create({
    data,
    include: {
      customer: true,
      createdByAdmin: true,
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
