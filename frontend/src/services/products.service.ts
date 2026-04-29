import { apiFetch } from "./api";
import type { Product } from "../types/product";

type ProductsResponse = {
  data: Product[];
};

type ProductResponse = {
  data: Product;
};

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

export function addProductImage(
  productId: string,
  payload: CreateProductImagePayload,
) {
  return apiFetch<ProductResponse>(`/admin/products/${productId}/images`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}