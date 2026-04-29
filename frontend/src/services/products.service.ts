import { apiFetch } from "./api";
import type { Product } from "../types/product";

type ProductsResponse = {
  data: Product[];
};

type ProductResponse = {
  data: Product;
};

export type CreateAdminProductPayload = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  brand?: string;
  stock: number;
  active: boolean;
  featured: boolean;
};

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>;

type CreateProductImagePayload = {
  url: string;
  publicId?: string;
  alt?: string;
  position?: number;
  isMain?: boolean;
};

export function getProducts() {
  return apiFetch<ProductsResponse>("/products");
}

export function getProductBySlug(slug: string) {
  return apiFetch<ProductResponse>(`/products/${slug}`);
}

export function getAdminProducts() {
  return apiFetch<ProductsResponse>("/admin/products");
}

export function createAdminProduct(payload: CreateAdminProductPayload) {
  return apiFetch<ProductResponse>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminProduct(
  productId: string,
  payload: UpdateAdminProductPayload,
) {
  return apiFetch<ProductResponse>(`/admin/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function addProductImage(
  productId: string,
  payload: CreateProductImagePayload,
) {
  return apiFetch<ProductResponse>(`/admin/products/${productId}/images`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}