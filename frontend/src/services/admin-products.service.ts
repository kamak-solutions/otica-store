import { apiFetch } from "./api";
import type { Product } from "../types/product";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

type ListAdminProductsResponse = {
  data: Product[];
};

type UpdateAdminProductResponse = {
  data: Product;
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

export function listAdminProducts() {
  return apiFetch<ListAdminProductsResponse>("/admin/products", {
    headers: getAdminAuthHeaders(),
  });
}

type CreateAdminProductPayload = {
  name: string;
  slug: string;
  description?: string;
  price: string;
  salePrice?: string | null;
  sku?: string | null;
  brand?: string | null;
  stock: number;
  active: boolean;
  featured: boolean;
  audience?: string | null;
  categoryId?: string | null;
};

export function createAdminProduct(payload: CreateAdminProductPayload) {
  return apiFetch<UpdateAdminProductResponse>("/admin/products", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateAdminProduct(
  id: string,
  payload: Partial<{
    name: string;
    slug: string;
    description: string;
    price: string;
    salePrice: string | null;
    sku: string | null;
    brand: string | null;
    stock: number;
    active: boolean;
    featured: boolean;
    audience: string | null;
    categoryId: string | null;
  }>,
) {
  return apiFetch<UpdateAdminProductResponse>(`/admin/products/${id}`, {
    method: "PUT",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function deactivateAdminProduct(id: string) {
  return apiFetch<UpdateAdminProductResponse>(`/admin/products/${id}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  });
}
type GetAdminProductResponse = {
  data: Product;
};

export function getAdminProductById(id: string) {
  return apiFetch<GetAdminProductResponse>(`/admin/products/${id}`, {
    headers: getAdminAuthHeaders(),
  });
}

type AddAdminProductImagePayload = {
  url: string;
  publicId?: string | null;
  alt?: string | null;
  position?: number;
  isMain?: boolean;
};

export function addAdminProductImage(
  id: string,
  payload: AddAdminProductImagePayload,
) {
  return apiFetch<UpdateAdminProductResponse>(`/admin/products/${id}/images`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}
