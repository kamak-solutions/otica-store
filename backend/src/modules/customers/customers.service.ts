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
export async function createAdminCustomer(customerData: {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  crmStatus?: string;
  lgpdAccepted: boolean;
  lgpdConsentSource?: string;
}) {
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      OR: [{ email: customerData.email }, { phone: customerData.phone }],
    },
  });

  if (existingCustomer) {
    throw new Error(
      "Já existe um cliente cadastrado com este e-mail ou telefone.",
    );
  }

  return prisma.customer.create({
    data: {
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      cpf: customerData.cpf || null,
      birthDate: customerData.birthDate
        ? new Date(customerData.birthDate)
        : null,
      crmStatus: customerData.crmStatus ?? "lead",

      zipcode: customerData.zipcode,
      state: customerData.state,
      city: customerData.city,
      street: customerData.street,
      number: customerData.number,
      complement: customerData.complement || null,
      district: customerData.district,

      lgpdAcceptedAt: customerData.lgpdAccepted ? new Date() : null,
      lgpdConsentSource: customerData.lgpdAccepted
        ? (customerData.lgpdConsentSource ?? "admin")
        : null,
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
