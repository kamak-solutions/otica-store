import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export type AdminCustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  crmStatus: string;
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

  orders: Array<{
    id: string;
    orderNumber: string | null;
    status: string;
    subtotal: string;
    createdAt: string;
  }>;

  createdAt: string;
  updatedAt: string;
};

type Response = {
  data: AdminCustomerDetail;
};

export function getAdminCustomer(id: string) {
  return apiFetch<Response>(`/admin/customers/${id}`, {
    headers: getAdminAuthHeaders(),
  });
}
