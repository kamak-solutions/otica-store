import { apiFetch } from "./api";

export type BlogPost = {
  id: string;

  title: string;

  slug: string;

  excerpt: string;

  content: {
    heading: string;
    paragraphs: string[];
  }[];

  imageUrl?: string | null;

  category: string;

  readingTime?: string | null;

  featured: boolean;

  published: boolean;

  publishedAt?: string | null;

  createdAt: string;

  updatedAt: string;
};

export function listBlogPosts() {
  return apiFetch<BlogPost[]>(
    "/blog/posts",
  );
}

export function getBlogPostBySlug(
  slug: string,
) {
  return apiFetch<BlogPost>(
    `/blog/posts/${slug}`,
  );
}