import { apiFetch } from "./api";

export type BlogCategory = {
  id: string;

  name: string;

  slug: string;

  description?: string | null;

  position: number;

  active: boolean;

  createdAt: string;

  updatedAt: string;
};

export function listBlogCategories() {
  return apiFetch<BlogCategory[]>(
    "/blog/categories",
  );
}

export function createBlogCategory(
  data: {
    name: string;
    description?: string;
    position?: number;
    active?: boolean;
  },
) {
  return apiFetch(
    "/admin/blog/categories",
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
}