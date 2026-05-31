import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/app-error.js";

export async function createCustomerInteraction(
  customerId: string,
  type: string,
  description: string,
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

  return prisma.customerInteraction.create({
    data: {
      customerId,
      type,
      description,
    },
  });
}

export async function listCustomerInteractions(
  customerId: string,
) {
  return prisma.customerInteraction.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findCustomerInteractionById(
  interactionId: string,
) {
  const interaction =
    await prisma.customerInteraction.findUnique({
      where: {
        id: interactionId,
      },
    });

  if (!interaction) {
    throw new AppError(
      "Interação não encontrada.",
      404,
      "Not found",
    );
  }

  return interaction;
}