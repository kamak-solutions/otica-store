import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { app } from "../../app.js";
import { signAdminToken, type AdminRole } from "../../lib/admin-jwt.js";
import { prisma } from "../../lib/prisma.js";

const ORDER_ID = "11111111-1111-4111-8111-111111111111";
const ADMIN_ID = "22222222-2222-4222-8222-222222222222";
const CUSTOMER_ID = "33333333-3333-4333-8333-333333333333";

function createToken(role: AdminRole = "owner") {
  return signAdminToken({
    sub: ADMIN_ID,
    email: "admin@otica.com",
    role,
  });
}

function mockActiveAdmin(role: AdminRole = "owner") {
  vi.spyOn(prisma.adminUser, "findUnique").mockResolvedValue({
    id: ADMIN_ID,
    name: "Administrador",
    email: "admin@otica.com",
    passwordHash: "hash-nao-utilizado",
    role,
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  });
}

function createOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: ORDER_ID,
    orderNumber: "OSR-123456",
    customerId: CUSTOMER_ID,
    status: "confirmed",

    subtotal: {
      toFixed: () => "199.90",
    },

    notes: null,

    paymentStatus: "refunded",
    paymentMethod: "pix_manual",
    paymentProvider: "manual",
    paymentProviderId: "E2E123456",
    paymentUrl: null,
    paidAt: null,

    shippingMethod: null,
    shippingPrice: null,
    shippingStatus: "not_required",

    attendanceId: null,
    createdByAdminId: ADMIN_ID,

    createdAt: new Date("2026-07-26T10:00:00.000Z"),
    updatedAt: new Date("2026-07-26T12:00:00.000Z"),

    customer: {
      id: CUSTOMER_ID,
      name: "Cliente Teste",
      email: "cliente@teste.com",
      phone: "11999999999",
      cpf: "12345678909",
      birthDate: new Date("1990-01-01T00:00:00.000Z"),
      zipcode: "01001000",
      state: "SP",
      street: "Praça da Sé",
      number: "100",
      complement: null,
      district: "Sé",
      city: "São Paulo",
      lgpdAcceptedAt: new Date("2026-01-01T00:00:00.000Z"),
      lgpdConsentSource: "checkout",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },

    items: [],

    ...overrides,
  };
}

function mockOrderUpdate() {
  return vi.spyOn(prisma.order, "update").mockResolvedValue({} as never);
}

function mockAuditCreate() {
  return vi
    .spyOn(prisma.adminAuditLog, "create")
    .mockResolvedValue({} as never);
}
function mockRefundTransaction(updatedOrder: ReturnType<typeof createOrder>) {
  const orderUpdateSpy = vi.fn().mockResolvedValue(updatedOrder);
  const paymentEventCreateSpy = vi.fn().mockResolvedValue({});

  const transactionSpy = vi
    .spyOn(prisma, "$transaction")
    .mockImplementation(async (callback: any) => {
      return callback({
        order: {
          update: orderUpdateSpy,
        },
        orderPaymentEvent: {
          create: paymentEventCreateSpy,
        },
      });
    });

  return {
    transactionSpy,
    orderUpdateSpy,
    paymentEventCreateSpy,
  };
}

async function postRefund(
  role: AdminRole = "owner",
  payload: Record<string, unknown> = {
    reason: "Pagamento registrado por engano.",
  },
) {
  mockActiveAdmin(role);

  return app.inject({
    method: "POST",
    url: `/admin/orders/${ORDER_ID}/manual-payment/refund`,
    headers: {
      authorization: `Bearer ${createToken(role)}`,
    },
    payload,
  });
}

describe("POST /admin/orders/:id/manual-payment/refund", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("bloqueia requisição sem token", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/admin/orders/${ORDER_ID}/manual-payment/refund`,
      payload: {
        reason: "Pagamento registrado por engano.",
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("bloqueia admin", async () => {
    const findUniqueSpy = vi
      .spyOn(prisma.order, "findUnique")
      .mockResolvedValue(null as never);

    const updateSpy = mockOrderUpdate();

    const response = await postRefund("admin");

    expect(response.statusCode).toBe(403);
    expect(findUniqueSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("permite owner estornar pagamento manual", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      paymentStatus: "paid",
      paymentProvider: "manual",
    } as never);

    const { transactionSpy, orderUpdateSpy, paymentEventCreateSpy } =
      mockRefundTransaction(createOrder());

    const auditSpy = mockAuditCreate();

    const response = await postRefund();

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        id: ORDER_ID,
        paymentStatus: "refunded",
        paymentProvider: "manual",
        paidAt: null,
      },
      message: "Pagamento manual estornado com sucesso.",
    });

    expect(transactionSpy).toHaveBeenCalledTimes(1);

    expect(orderUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: ORDER_ID,
        },
        data: {
          paymentStatus: "refunded",
          paidAt: null,
        },
      }),
    );

    expect(paymentEventCreateSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        orderId: ORDER_ID,
        eventType: "manual_payment_refunded",
        status: "refunded",
        method: "pix_manual",
        provider: "manual",
        reference: "E2E123456",
        reason: "Pagamento registrado por engano.",
        adminId: ADMIN_ID,
        adminEmail: "admin@otica.com",
        adminRole: "owner",
      }),
    });

    expect(auditSpy).toHaveBeenCalled();
  });

  it("bloqueia pedido já entregue", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "delivered",
      paymentStatus: "paid",
      paymentProvider: "manual",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postRefund();

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "Não é possível estornar manualmente um pedido já entregue.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("bloqueia pedido sem pagamento confirmado", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      paymentStatus: "pending",
      paymentProvider: "manual",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postRefund();

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "Este pedido não possui pagamento confirmado para estorno.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("bloqueia pagamento que não é manual", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      paymentStatus: "paid",
      paymentProvider: "mercado_pago",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postRefund();

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "Este pagamento não foi registrado manualmente.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("exige motivo com ao menos 10 caracteres", async () => {
    const findUniqueSpy = vi
      .spyOn(prisma.order, "findUnique")
      .mockResolvedValue(null as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postRefund("owner", {
      reason: "erro",
    });

    expect(response.statusCode).toBe(400);

    expect(findUniqueSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });
});
