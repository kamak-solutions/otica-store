import { z } from "zod";

export const customerIdParamsSchema = z.object({
  customerId: z.string().uuid(),
});

export const createCustomerNoteBodySchema = z.object({
  note: z.string().trim().min(1).max(1000),
});

export type CustomerIdParams = z.infer<
  typeof customerIdParamsSchema
>;

export type CreateCustomerNoteBody = z.infer<
  typeof createCustomerNoteBodySchema
>;