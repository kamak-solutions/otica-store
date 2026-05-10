import { z } from "zod";

export const quoteRequestStatusSchema = z.enum([
  "pending",
  "in_analysis",
  "quoted",
  "converted",
  "cancelled",
]);

export const updateQuoteRequestStatusParamsSchema = z.object({
  id: z.string().uuid("ID da solicitação inválido."),
});

export const updateQuoteRequestStatusBodySchema = z.object({
  status: quoteRequestStatusSchema,
});

export type UpdateQuoteRequestStatusParams = z.infer<
  typeof updateQuoteRequestStatusParamsSchema
>;

export type UpdateQuoteRequestStatusBody = z.infer<
  typeof updateQuoteRequestStatusBodySchema
>;