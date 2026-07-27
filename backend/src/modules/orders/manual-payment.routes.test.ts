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

    paymentStatus: "paid",
    paymentMethod: "pix_manual",
    paymentProvider: "manual",
    paymentProviderId: "E2E123456",
    paymentUrl: null,
    paidAt: new Date("2026-07-26T12:00:00.000Z"),

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

function mockPaymentTransaction(updatedOrder: ReturnType<typeof createOrder>) {
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

async function postManualPayment(
  role: AdminRole = "owner",
  payload: Record<string, unknown> = {
    method: "pix_manual",
    amount: 199.9,
    reference: "E2E123456",
  },
) {
  mockActiveAdmin(role);

  return app.inject({
    method: "POST",
    url: `/admin/orders/${ORDER_ID}/manual-payment`,
    headers: {
      authorization: `Bearer ${createToken(role)}`,
    },
    payload,
  });
}

describe("POST /admin/orders/:id/manual-payment", () => {
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
      url: `/admin/orders/${ORDER_ID}/manual-payment`,
      payload: {
        method: "cash",
        amount: 199.9,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("bloqueia collaborator", async () => {
    const findUniqueSpy = vi
      .spyOn(prisma.order, "findUnique")
      .mockResolvedValue(null as never);

    const updateSpy = mockOrderUpdate();

    const response = await postManualPayment("collaborator");

    expect(response.statusCode).toBe(403);
    expect(findUniqueSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("permite owner confirmar PIX manual", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      subtotal: "199.90",
      shippingPrice: null,
      paymentStatus: "pending",
    } as never);

    const { transactionSpy, orderUpdateSpy, paymentEventCreateSpy } =
      mockPaymentTransaction(createOrder());

    const auditSpy = mockAuditCreate();

    const response = await postManualPayment();

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        id: ORDER_ID,
        paymentStatus: "paid",
        paymentMethod: "pix_manual",
        paymentProvider: "manual",
      },
      message: "Pagamento manual confirmado com sucesso.",
    });

    expect(transactionSpy).toHaveBeenCalledTimes(1);

    expect(orderUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: ORDER_ID,
        },
        data: expect.objectContaining({
          paymentStatus: "paid",
          paymentMethod: "pix_manual",
          paymentProvider: "manual",
          paymentProviderId: "E2E123456",
          paymentUrl: null,
        }),
      }),
    );

    expect(paymentEventCreateSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        orderId: ORDER_ID,
        eventType: "manual_payment_confirmed",
        status: "paid",
        amount: 199.9,
        method: "pix_manual",
        provider: "manual",
        reference: "E2E123456",
        adminId: ADMIN_ID,
        adminEmail: "admin@otica.com",
        adminRole: "owner",
      }),
    });

    expect(auditSpy).toHaveBeenCalled();
  });

  it("bloqueia pagamento com valor diferente do pedido", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      subtotal: "199.90",
      shippingPrice: null,
      paymentStatus: "pending",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postManualPayment("owner", {
      method: "cash",
      amount: 100,
    });

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "O valor informado deve ser exatamente R$ 199,90.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("bloqueia pagamento duplicado", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "confirmed",
      subtotal: "199.90",
      shippingPrice: null,
      paymentStatus: "paid",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postManualPayment();

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "Este pedido já possui pagamento confirmado.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("bloqueia pedido cancelado", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
      status: "cancelled",
      subtotal: "199.90",
      shippingPrice: null,
      paymentStatus: "pending",
    } as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postManualPayment();

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message: "Não é possível registrar pagamento em um pedido cancelado.",
    });

    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });

  it("exige referência para PIX manual", async () => {
    const findUniqueSpy = vi
      .spyOn(prisma.order, "findUnique")
      .mockResolvedValue(null as never);

    const updateSpy = mockOrderUpdate();
    const auditSpy = mockAuditCreate();

    const response = await postManualPayment("owner", {
      method: "pix_manual",
      amount: 199.9,
    });

    expect(response.statusCode).toBe(400);

    expect(findUniqueSpy).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(auditSpy).not.toHaveBeenCalled();
  });
});
