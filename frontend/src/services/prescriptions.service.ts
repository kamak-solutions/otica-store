import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type OpticalPrescription = {
  id: string;
  customerId: string;

  examDate: string | null;
  expiresAt: string | null;

  rightSpherical: string | null;
  rightCylindrical: string | null;
  rightAxis: string | null;

  leftSpherical: string | null;
  leftCylindrical: string | null;
  leftAxis: string | null;

  addition: string | null;
  pupillaryDistance: string | null;
  height: string | null;

  doctorName: string | null;
  doctorCrm: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreatePrescriptionInput = {
  examDate?: string;
  expiresAt?: string;

  rightSpherical?: string;
  rightCylindrical?: string;
  rightAxis?: string;

  leftSpherical?: string;
  leftCylindrical?: string;
  leftAxis?: string;

  addition?: string;
  pupillaryDistance?: string;
  height?: string;

  doctorName?: string;
  doctorCrm?: string;

  notes?: string;
};

type ListPrescriptionsResponse = {
  data: OpticalPrescription[];
};

type PrescriptionResponse = {
  data: OpticalPrescription;
  message?: string;
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

export function listCustomerPrescriptions(customerId: string) {
  return apiFetch<ListPrescriptionsResponse>(
    `/admin/customers/${customerId}/prescriptions`,
    {
      headers: getAdminAuthHeaders(),
    },
  );
}

export function createCustomerPrescription(
  customerId: string,
  data: CreatePrescriptionInput,
) {
  return apiFetch<PrescriptionResponse>(
    `/admin/customers/${customerId}/prescriptions`,
    {
      method: "POST",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(data),
    },
  );
}