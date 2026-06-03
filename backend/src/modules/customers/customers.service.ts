import { prisma } from "../../lib/prisma.js";

export async function listAdminCustomers() {
  return prisma.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          subtotal: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
export async function findAdminCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          subtotal: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
export async function updateCustomerCrmStatus(
  customerId: string,
  crmStatus: string,
) {
  return prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      crmStatus,
    },
    include: {
      orders: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          subtotal: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
