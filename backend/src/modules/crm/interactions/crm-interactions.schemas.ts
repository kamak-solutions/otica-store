import { z } from "zod";

export const customerInteractionParamsSchema = z.object({
  customerId: z.string().uuid("ID do cliente inválido."),
});

export const interactionIdParamsSchema = z.object({
  id: z.string().uuid("ID da interação inválido."),
});

export const interactionTypeSchema = z.enum([
  "whatsapp",
  "phone_call",
  "email",
  "visit",
  "quote_sent",
  "sale_completed",
  "support",
  "custom",
]);

export const createCustomerInteractionBodySchema = z.object({
  type: interactionTypeSchema,

  description: z
    .string()
    .min(2, "Descrição é obrigatória.")
    .max(1000, "Descrição muito longa."),
});

export type CustomerInteractionParams = z.infer<
  typeof customerInteractionParamsSchema
>;

export type InteractionIdParams = z.infer<
  typeof interactionIdParamsSchema
>;

export type CreateCustomerInteractionBody = z.infer<
  typeof createCustomerInteractionBodySchema
>;

export type InteractionType = z.infer<
  typeof interactionTypeSchema
>;