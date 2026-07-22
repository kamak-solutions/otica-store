import { z } from "zod";

export const laboratoryOrderIdParamsSchema = z.object({
  id: z.string().uuid("ID do pedido laboratorial inválido."),
});

export type LaboratoryOrderIdParams = z.infer<
  typeof laboratoryOrderIdParamsSchema
>;

export const createLaboratoryOrderBodySchema = z.object({
  orderId: z.string().uuid("ID do pedido inválido."),

  laboratoryId: z.string().uuid("ID do laboratório inválido."),

  prescriptionId: z
    .string()
    .uuid("ID da receita inválido.")
    .optional(),

  externalOrderNumber: z
    .string()
    .trim()
    .max(100, "Número externo muito longo.")
    .optional()
    .transform((value) => value || undefined),

  expectedAt: z.coerce
    .date()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000, "Observações muito longas.")
    .optional()
    .transform((value) => value || undefined),
});

export type CreateLaboratoryOrderBody = z.infer<
  typeof createLaboratoryOrderBodySchema
>;

export const laboratoryOrderStatusSchema = z.enum([
  "pending",
  "sent",
  "received_by_laboratory",
  "in_production",
  "ready",
  "received_at_store",
  "mounted",
  "delivered",
]);

export type LaboratoryOrderStatus = z.infer<
  typeof laboratoryOrderStatusSchema
>;

export const updateLaboratoryOrderStatusBodySchema = z.object({
  status: laboratoryOrderStatusSchema,

  externalOrderNumber: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),

  expectedAt: z.coerce
    .date()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => value || undefined),
});

export type UpdateLaboratoryOrderStatusBody = z.infer<
  typeof updateLaboratoryOrderStatusBodySchema
>;