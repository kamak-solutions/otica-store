import { apiFetch } from "./api";
import type { Category } from "../types/category";

type CategoriesResponse = {
  data: Category[];
};

export function getCategories() {
  return apiFetch<CategoriesResponse>("/categories");
}
