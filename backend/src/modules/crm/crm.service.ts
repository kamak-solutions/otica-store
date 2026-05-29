import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";


export async function createCustomerNote(
  customerId: string,
  note: string,
) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new AppError(
      "Cliente não encontrado.",
      404,
      "Not found",
    );
  }

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