import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/app-error.js";

export async function createCustomerReminder(
  customerId: string,
  type: string,
  title: string,
  dueDate: string,
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

  return prisma.customerReminder.create({
    data: {
      customerId,
      type,
      title,
      dueDate: new Date(dueDate),
    },
  });
}

export async function listCustomerReminders(
  customerId: string,
) {
  return prisma.customerReminder.findMany({
    where: {
      customerId,
    },
    orderBy: {
      dueDate: "asc",
    },
  });
}

export async function completeCustomerReminder(
  reminderId: string,
) {
  const reminder = await prisma.customerReminder.findUnique({
    where: {
      id: reminderId,
    },
  });

  if (!reminder) {
    throw new AppError(
      "Lembrete não encontrado.",
      404,
      "Not found",
    );
  }

  return prisma.customerReminder.update({
    where: {
      id: reminderId,
    },
    data: {
      completed: true,
    },
  });
}