import { z } from "zod";

export const createOrderBodySchema = z.object({
  customer: z.object({
    customerName: z.string().min(2, "Nome é obrigatório."),
    customerEmail: z.string().email("E-mail inválido."),
    customerPhone: z.string().min(8, "Telefone é obrigatório."),
    customerCpf: z.string().min(11, "CPF é obrigatório."),
    birthDate: z.string().min(10, "Data de nascimento é obrigatória."),
    lgpdAccepted: z.literal(true, {
      error: "Você precisa aceitar os termos de privacidade.",
    }),
    zipcode: z.string().min(3, "CEP é obrigatório."),
    state: z.string().min(2, "Estado é obrigatório.").max(2),
    street: z.string().min(2, "Endereço é obrigatório."),
    number: z.string().min(1, "Número é obrigatório."),
    complement: z.string().optional(),
    district: z.string().min(2, "Bairro é obrigatório."),
    city: z.string().min(2, "Cidade é obrigatória."),
    attendanceId: z.string().uuid().optional(),
    notes: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("ID do produto inválido."),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "Pedido precisa ter ao menos um item."),
});

export const orderIdParamsSchema = z.object({
  id: z.string().uuid("ID do pedido inválido."),
});

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
]);

export const updateOrderStatusBodySchema = z.object({
  status: orderStatusSchema,
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBodySchema>;

export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
