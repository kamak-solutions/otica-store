import { z } from "zod";

const optionalText = (maximumLength: number) =>
  z
    .string()
    .trim()
    .max(maximumLength)
    .optional()
    .transform((value) => value || undefined);

export const supplierIdParamsSchema = z.object({
  id: z.string().uuid("ID do fornecedor inválido."),
});

export type SupplierIdParams = z.infer<typeof supplierIdParamsSchema>;

export const createSupplierBodySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Código do fornecedor é obrigatório.")
    .max(30, "Código do fornecedor muito longo.")
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(2, "Nome do fornecedor é obrigatório.")
    .max(120, "Nome do fornecedor muito longo."),

  contactName: optionalText(120),

  phone: optionalText(30),

  email: z
    .string()
    .trim()
    .email("E-mail do fornecedor inválido.")
    .max(160)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),

  active: z.boolean().default(true),
});

export type CreateSupplierBody = z.infer<
  typeof createSupplierBodySchema
>;

export const updateSupplierBodySchema = createSupplierBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type UpdateSupplierBody = z.infer<
  typeof updateSupplierBodySchema
>;