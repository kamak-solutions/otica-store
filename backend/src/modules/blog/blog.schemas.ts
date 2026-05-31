import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(3, "Título obrigatório."),

  excerpt: z.string().min(10, "Resumo obrigatório."),

  content: z.any(),

  imageUrl: z.string().optional().nullable(),

  categoryId: z.string().min(1, "Categoria obrigatória."),

  readingTime: z.string().optional().nullable(),

  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
