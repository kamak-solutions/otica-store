import { z } from "zod";

export const productCollectionIdParamsSchema = z.object({
  id: z.string().uuid("ID da coleção inválido."),
});

export type ProductCollectionIdParams = z.infer<
  typeof productCollectionIdParamsSchema
>;

export const createProductCollectionBodySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Código da coleção é obrigatório.")
    .max(30, "Código da coleção muito longo.")
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(2, "Nome da coleção é obrigatório.")
    .max(120, "Nome da coleção muito longo."),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || undefined),

  active: z.boolean().default(true),
});

export type CreateProductCollectionBody = z.infer<
  typeof createProductCollectionBodySchema
>;

export const updateProductCollectionBodySchema =
  createProductCollectionBodySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Informe ao menos um campo para atualizar.",
    });

export type UpdateProductCollectionBody = z.infer<
  typeof updateProductCollectionBodySchema
>;