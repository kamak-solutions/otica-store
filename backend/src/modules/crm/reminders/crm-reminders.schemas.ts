import { z } from "zod";

export const customerReminderParamsSchema = z.object({
  customerId: z.string().uuid("ID do cliente inválido."),
});

export const reminderIdParamsSchema = z.object({
  id: z.string().uuid("ID do lembrete inválido."),
});

export const reminderTypeSchema = z.enum([
  "birthday",
  "post_sale",
  "annual_review",
  "lens_replacement",
  "follow_up",
  "custom",
]);

export const createCustomerReminderBodySchema = z.object({
  type: reminderTypeSchema,

  title: z
    .string()
    .min(2, "Título é obrigatório.")
    .max(255, "Título muito longo."),

  dueDate: z.string().datetime("Data inválida."),
});

export type CustomerReminderParams = z.infer<
  typeof customerReminderParamsSchema
>;

export type ReminderIdParams = z.infer<
  typeof reminderIdParamsSchema
>;

export type CreateCustomerReminderBody = z.infer<
  typeof createCustomerReminderBodySchema
>;

export type ReminderType = z.infer<
  typeof reminderTypeSchema
>;