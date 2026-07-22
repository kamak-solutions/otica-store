import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";
import type { CreateAdminCustomerBody } from "./customers.schemas.js";
import type { Prisma } from "../../generated/prisma/client.js";

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
export async function createAdminCustomer(
  customerData: CreateAdminCustomerBody,
) {
  const duplicateConditions: Prisma.CustomerWhereInput[] = [
    { email: customerData.email },
    { phone: customerData.phone },
  ];

  if (customerData.cpf) {
    duplicateConditions.push({
      cpf: customerData.cpf,
    });
  }

  const existingCustomer = await prisma.customer.findFirst({
    where: {
      OR: duplicateConditions,
    },
    select: {
      id: true,
      email: true,
      phone: true,
      cpf: true,
    },
  });

  if (existingCustomer) {
    throw new AppError(
      "Já existe um cliente cadastrado com este e-mail, telefone ou CPF.",
      409,
      "Conflict",
    );
  }

  return prisma.customer.create({
    data: {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      cpf: customerData.cpf ?? null,

      birthDate: customerData.birthDate
        ? new Date(`${customerData.birthDate}T00:00:00.000Z`)
        : null,

      crmStatus: customerData.crmStatus ?? "lead",

      zipcode: customerData.zipcode,
      state: customerData.state,
      city: customerData.city,
      street: customerData.street,
      number: customerData.number,
      complement: customerData.complement ?? null,
      district: customerData.district,

      lgpdAcceptedAt: new Date(),
      lgpdConsentSource: customerData.lgpdConsentSource ?? "admin",
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
