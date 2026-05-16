import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";

type MercadoPagoPreferenceItem = {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: "BRL";
};

type CreatePreferenceInput = {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  items: MercadoPagoPreferenceItem[];
};

type MercadoPagoPreferenceResponse = {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
};

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput,
) {
  if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new AppError(
      "Mercado Pago não configurado.",
      500,
      "Internal Server Error",
    );
  }

  const response = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_reference: input.orderId,
        items: input.items,
        payer: {
          email: input.customerEmail,
        },
        metadata: {
          orderId: input.orderId,
          orderNumber: input.orderNumber,
        },
        back_urls: {
          success: `${env.FRONTEND_URL}/checkout/sucesso`,
          failure: `${env.FRONTEND_URL}/checkout/falha`,
          pending: `${env.FRONTEND_URL}/checkout/pendente`,
        },
      }),
    },
  );

  const data = (await response.json()) as
    | MercadoPagoPreferenceResponse
    | { message?: string; error?: string; status?: number };

  if (!response.ok) {
    console.error("Mercado Pago preference error:", data);

throw new AppError(
  "Erro ao criar preferência de pagamento no Mercado Pago.",
  502,
  "Bad Gateway",
);
  }

  const preference = data as MercadoPagoPreferenceResponse;
  const paymentUrl = preference.sandbox_init_point ?? preference.init_point;

  if (!preference.id || !paymentUrl) {
    throw new AppError(
      "Resposta inválida do Mercado Pago ao criar pagamento.",
      502,
      "Bad Gateway",
    );
  }

  return {
    providerId: preference.id,
    paymentUrl,
  };
}
type MercadoPagoPaymentResponse = {
  id: number;
  status: string;
  status_detail?: string;
  payment_method_id?: string;
  external_reference?: string;
  transaction_amount?: number;
  date_approved?: string | null;
};

export async function getMercadoPagoPayment(paymentId: string) {
  if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new AppError(
      "Mercado Pago não configurado.",
      500,
      "Internal Server Error",
    );
  }

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    },
  );

  const data = (await response.json()) as
    | MercadoPagoPaymentResponse
    | { message?: string; error?: string; status?: number };

  if (!response.ok) {
    console.error("Mercado Pago payment query error:", data);

    throw new AppError(
      "Erro ao consultar pagamento no Mercado Pago.",
      502,
      "Bad Gateway",
    );
  }

  return data as MercadoPagoPaymentResponse;
}