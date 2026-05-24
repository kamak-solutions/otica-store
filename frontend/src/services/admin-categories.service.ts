import { apiFetch } from "./api";
import type { Category } from "../types/category";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(
    ADMIN_TOKEN_STORAGE_KEY,
  );

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

type CategoryResponse = {
  data: Category[];
};

type SingleCategoryResponse = {
  data: Category;
};

type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
};

export function listAdminCategories() {
  return apiFetch<CategoryResponse>(
    "/categories",
    {
      headers: getAdminAuthHeaders(),
    },
  );
}

export function createAdminCategory(
  payload: CreateCategoryPayload,
) {
  return apiFetch<SingleCategoryResponse>(
    "/admin/categories",
    {
      method: "POST",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}

export function updateAdminCategory(
  id: string,
  payload: Partial<CreateCategoryPayload>,
) {
  return apiFetch<SingleCategoryResponse>(
    `/admin/categories/${id}`,
    {
      method: "PUT",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}