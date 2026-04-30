import { apiFetch } from "./api";
import type { Product } from "../types/product";

type ProductsResponse = {
  data: Product[];
};

type ProductResponse = {
  data: Product;
};

export function getProducts() {
  return apiFetch<ProductsResponse>("/products");
}

export function getProductBySlug(slug: string) {
  return apiFetch<ProductResponse>(`/products/${slug}`);
}
