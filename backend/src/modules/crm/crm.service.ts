import { prisma } from "../../lib/prisma.js";

export async function createCustomerNote(
  customerId: string,
  note: string,
) {
  return prisma.customerNote.create({
    data: {
      customerId,
      note,
    },
  });
}

export async function listCustomerNotes(customerId: string) {
  return prisma.customerNote.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}