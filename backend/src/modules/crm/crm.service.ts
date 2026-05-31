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
export async function getCrmDashboard() {
  const today = new Date();

  const remindersPending = await prisma.customerReminder.count({
    where: {
      completed: false,
    },
  });

  const remindersOverdue = await prisma.customerReminder.count({
    where: {
      completed: false,
      dueDate: {
        lt: today,
      },
    },
  });

  const totalCustomers = await prisma.customer.count();

  const interactionsLast30Days =
    await prisma.customerInteraction.count({
      where: {
        createdAt: {
          gte: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ),
        },
      },
    });

  return {
    remindersPending,
    remindersOverdue,
    totalCustomers,
    interactionsLast30Days,
  };
}