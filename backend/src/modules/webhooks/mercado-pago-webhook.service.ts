import { prisma } from "../../lib/prisma.js";
import { getMercadoPagoPayment } from "../payments/mercado-pago.service.js";

type MercadoPagoWebhookBody = {
  type?: string;
  action?: string;
  data?: {
    id?: string;
  };
};

function mapMercadoPagoStatusToPaymentStatus(status: string) {
  if (status === "approved") {
    return "paid";
  }

  if (status === "rejected") {
    return "failed";
  }

  if (status === "cancelled") {
    return "cancelled";
  }

  if (status === "refunded" || status === "charged_back") {
    return "refunded";
  }

  return "waiting_payment";
}

export async function processMercadoPagoWebhook(body: MercadoPagoWebhookBody) {
  const paymentId = body.data?.id;

  if (!paymentId) {
    return {
      ignored: true,
      reason: "missing_payment_id",
    };
  }

  const payment = await getMercadoPagoPayment(paymentId);

  const orderId = payment.external_reference;

  if (!orderId) {
    return {
      ignored: true,
      reason: "missing_external_reference",
      paymentId,
    };
  }

  const paymentStatus = mapMercadoPagoStatusToPaymentStatus(payment.status);

  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      paymentStatus,
      paymentMethod: payment.payment_method_id ?? "mercado_pago",
      paymentProvider: "mercado_pago",
      paymentProviderId: String(payment.id),
      paidAt:
        payment.status === "approved"
          ? payment.date_approved
            ? new Date(payment.date_approved)
            : new Date()
          : null,
      status: payment.status === "approved" ? "confirmed" : undefined,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  return {
    ignored: false,
    paymentId,
    orderId: order.id,
    paymentStatus: order.paymentStatus,
    orderStatus: order.status,
  };
}
