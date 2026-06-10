import { apiFetch } from "./api";

export type BlogPost = {
  id: string;

  title: string;

  slug: string;

  excerpt: string;

content: string;

  imageUrl?: string | null;

  categoryId?: string | null;

  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  readingTime?: string | null;

  published: boolean;

  publishedAt?: string | null;

  createdAt: string;

  updatedAt: string;
};

export function listBlogPosts() {
  return apiFetch<BlogPost[]>("/blog/posts");
}

export function getBlogPostBySlug(slug: string) {
  return apiFetch<BlogPost>(`/blog/posts/${slug}`);
}
export function getBlogPostById(id: string) {
  return apiFetch<BlogPost>(`/admin/blog/posts/${id}`);
}
export function deleteBlogPost(id: string) {
  return apiFetch<void>(`/admin/blog/posts/${id}`, {
    method: "DELETE",
  });
}
export type CreateBlogPostInput = {
  title: string;

  excerpt: string;

  categoryId: string;

content: string;

  imageUrl?: string;

  cloudinaryPublicId?: string;

  readingTime?: string;

  published: boolean;
};
export function createBlogPost(data: CreateBlogPostInput) {
  return apiFetch<BlogPost>("/admin/blog/posts", {
    method: "POST",

    body: JSON.stringify(data),
  });
}
export function updateBlogPost(id: string, data: CreateBlogPostInput) {
  return apiFetch<BlogPost>(`/admin/blog/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
