import { z } from "zod";

export const createQuoteRequestBodySchema = z.object({
  customerName: z.string().min(2, "Nome é obrigatório."),
  customerEmail: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  customerPhone: z.string().min(8, "Telefone é obrigatório."),

  requestType: z.string().min(2, "Tipo de solicitação é obrigatório."),
  prescriptionText: z.string().optional(),
  notes: z.string().optional(),

  prescriptionFileUrl: z.string().url("URL da receita inválida.").optional(),
  prescriptionPublicId: z.string().optional(),
});

export type CreateQuoteRequestBody = z.infer<
  typeof createQuoteRequestBodySchema
>;