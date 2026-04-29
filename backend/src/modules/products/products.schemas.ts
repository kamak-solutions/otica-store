import { z } from "zod";

export const getProductBySlugParamsSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug é obrigatório.")
    .max(120, "Slug muito longo."),
});

export type GetProductBySlugParams = z.infer<
  typeof getProductBySlugParamsSchema
>;