import { z } from "zod";

export const createOrderBodySchema = z.object({
  customer: z.object({
    customerName: z.string().min(2, "Nome é obrigatório."),
    customerEmail: z.string().email("E-mail inválido."),
    customerPhone: z.string().min(8, "Telefone é obrigatório."),
    zipcode: z.string().min(3, "CEP é obrigatório."),
    state: z.string().min(2, "Estado é obrigatório.").max(2),
    street: z.string().min(2, "Endereço é obrigatório."),
    number: z.string().min(1, "Número é obrigatório."),
    complement: z.string().optional(),
    district: z.string().min(2, "Bairro é obrigatório."),
    city: z.string().min(2, "Cidade é obrigatória."),
    notes: z.string().optional(),
  }),

  items: z
    .array(
      z.object({
        productId: z.string().uuid("ID do produto inválido."),
        productName: z.string().min(1),
        unitPrice: z.coerce.number().positive(),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1, "Pedido precisa ter ao menos um item."),

  subtotal: z.coerce.number().positive(),
});

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;