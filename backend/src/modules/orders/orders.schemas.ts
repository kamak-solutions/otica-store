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
export const manualPaymentMethodSchema = z.enum([
  "pix_manual",
  "cash",
  "credit_card",
  "debit_card",
  "courtesy",
]);

export const confirmManualPaymentBodySchema = z
  .object({
    method: manualPaymentMethodSchema,

    amount: z.coerce
      .number()
      .positive("O valor recebido precisa ser maior que zero."),

    reference: z
      .string()
      .trim()
      .min(3, "A referência do pagamento precisa ter ao menos 3 caracteres.")
      .max(120, "A referência do pagamento é muito longa.")
      .optional(),

    installments: z.coerce
      .number()
      .int()
      .min(1, "O número de parcelas precisa ser maior que zero.")
      .max(24, "O número máximo permitido é de 24 parcelas.")
      .optional(),

    paidAt: z.coerce.date().optional(),

    notes: z
      .string()
      .trim()
      .max(500, "A observação pode ter no máximo 500 caracteres.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      ["pix_manual", "credit_card", "debit_card"].includes(data.method) &&
      !data.reference
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["reference"],
        message: "Informe a referência, NSU ou identificador da transação.",
      });
    }

    if (data.installments !== undefined && data.method !== "credit_card") {
      ctx.addIssue({
        code: "custom",
        path: ["installments"],
        message: "Parcelamento só pode ser informado para cartão de crédito.",
      });
    }

    if (data.method === "credit_card" && data.installments === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["installments"],
        message: "Informe o número de parcelas do cartão de crédito.",
      });
    }
  });
  export const refundManualPaymentBodySchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "O motivo do estorno precisa ter ao menos 10 caracteres.")
    .max(500, "O motivo do estorno pode ter no máximo 500 caracteres."),
});

export type RefundManualPaymentBody = z.infer<
  typeof refundManualPaymentBodySchema
>;

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBodySchema>;

export type ManualPaymentMethod = z.infer<typeof manualPaymentMethodSchema>;

export type ConfirmManualPaymentBody = z.infer<
  typeof confirmManualPaymentBodySchema
>;

export type OrderIdParams = z.infer<typeof orderIdParamsSchema>;

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
