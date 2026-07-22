import type { CustomerCrmStatus } from "./customers.schemas.js";

type CustomerWithOrders = {
  crmStatus: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  birthDate: Date | null;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  lgpdAcceptedAt: Date | null;
  lgpdConsentSource: string | null;
  createdAt: Date;
  updatedAt: Date;
  orders: Array<{
    id: string;
    orderNumber: string | null;
    status: string;
    subtotal: unknown;
    createdAt: Date;
  }>;
};

function maskCpf(cpf: string | null) {
  if (!cpf) {
    return null;
  }

  const normalizedCpf = cpf.replace(/\D/g, "");

  if (normalizedCpf.length !== 11) {
    return "***.***.***-**";
  }

  return `${normalizedCpf.slice(0, 3)}.***.***-${normalizedCpf.slice(9, 11)}`;
}

export function mapCustomerToHttp(customer: CustomerWithOrders) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    crmStatus: customer.crmStatus,
    cpf: maskCpf(customer.cpf),
    birthDate: customer.birthDate?.toISOString() ?? null,
    address: {
      zipcode: customer.zipcode,
      state: customer.state,
      street: customer.street,
      number: customer.number,
      complement: customer.complement,
      district: customer.district,
      city: customer.city,
    },
    lgpd: {
      acceptedAt: customer.lgpdAcceptedAt?.toISOString() ?? null,
      consentSource: customer.lgpdConsentSource,
    },
    orders: customer.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: String(order.subtotal),
      createdAt: order.createdAt.toISOString(),
    })),
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}
