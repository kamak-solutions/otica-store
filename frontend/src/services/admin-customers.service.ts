import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type AdminCustomerOrder = {
  id: string;
  orderNumber: string | null;
  status: string;
  subtotal: string;
  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  birthDate: string | null;
  address: {
    zipcode: string;
    state: string;
    street: string;
    number: string;
    complement: string | null;
    district: string;
    city: string;
  };
  lgpd: {
    acceptedAt: string | null;
    consentSource: string | null;
  };
  orders: AdminCustomerOrder[];
  createdAt: string;
  updatedAt: string;
};

type ListAdminCustomersResponse = {
  data: AdminCustomer[];
};

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function listAdminCustomers() {
  return apiFetch<ListAdminCustomersResponse>("/admin/customers", {
    headers: getAdminAuthHeaders(),
  });
}

export type CreateAdminCustomerInput = {
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
};

export function createAdminCustomer(data: CreateAdminCustomerInput) {
  return apiFetch<{ data: AdminCustomer }>("/admin/customers", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data),
  });
}
