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

export const productIdParamsSchema = z.object({
  id: z.string().uuid("ID do produto inválido."),
});

export type ProductIdParams = z.infer<typeof productIdParamsSchema>;

export const createProductBodySchema = z.object({
  name: z.string().min(2, "Nome é obrigatório.").max(120),
  slug: z.string().min(2, "Slug é obrigatório.").max(120),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive("Preço precisa ser maior que zero."),
  salePrice: z.coerce.number().positive().optional(),
  sku: z.string().max(80).optional(),
  brand: z.string().max(80).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type CreateProductBody = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = createProductBodySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Informe ao menos um campo para atualizar.",
  },
);

export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;