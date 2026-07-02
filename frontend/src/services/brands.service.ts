import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ListBrandsResponse = {
  data: Brand[];
};

type BrandResponse = {
  data: Brand;
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

export function listBrands() {
  return apiFetch<ListBrandsResponse>("/brands");
}

export function createBrand(data: {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}) {
  return apiFetch<BrandResponse>("/admin/brands", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export function updateBrand(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    website: string;
  }>,
) {
  return apiFetch<BrandResponse>(`/admin/brands/${id}`, {
    method: "PUT",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(data),
  });
}

export function deleteBrand(id: string) {
  return apiFetch<BrandResponse>(`/admin/brands/${id}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  });
}