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

async function getPaymentEvents(role: AdminRole = "owner") {
  mockActiveAdmin(role);

  return app.inject({
    method: "GET",
    url: `/admin/orders/${ORDER_ID}/payment-events`,
    headers: {
      authorization: `Bearer ${createToken(role)}`,
    },
  });
}

describe("GET /admin/orders/:id/payment-events", () => {
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
      method: "GET",
      url: `/admin/orders/${ORDER_ID}/payment-events`,
    });

    expect(response.statusCode).toBe(401);
  });

  it.each<AdminRole>(["owner", "admin", "collaborator", "viewer"])(
    "permite acesso para %s",
    async (role) => {
      vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
        id: ORDER_ID,
      } as never);

      vi.spyOn(prisma.orderPaymentEvent, "findMany").mockResolvedValue([
        {
          id: "44444444-4444-4444-8444-444444444444",
          orderId: ORDER_ID,
          eventType: "manual_payment_refunded",
          status: "refunded",
          amount: null,
          method: "cash",
          provider: "manual",
          reference: null,
          installments: null,
          notes: null,
          reason: "Estorno para validar o histórico imutável.",
          occurredAt: new Date("2026-07-27T04:00:00.000Z"),
          adminId: ADMIN_ID,
          adminEmail: "admin@otica.com",
          adminRole: "owner",
          createdAt: new Date("2026-07-27T04:00:00.000Z"),
        },
        {
          id: "55555555-5555-4555-8555-555555555555",
          orderId: ORDER_ID,
          eventType: "manual_payment_confirmed",
          status: "paid",
          amount: {
            toFixed: () => "109.90",
          },
          method: "cash",
          provider: "manual",
          reference: null,
          installments: null,
          notes: "Teste do histórico imutável de pagamento.",
          reason: null,
          occurredAt: new Date("2026-07-27T03:50:00.000Z"),
          adminId: ADMIN_ID,
          adminEmail: "admin@otica.com",
          adminRole: "owner",
          createdAt: new Date("2026-07-27T03:50:00.000Z"),
        },
      ] as never);

      const response = await getPaymentEvents(role);

      expect(response.statusCode).toBe(200);

      expect(response.json()).toMatchObject({
        data: [
          {
            eventType: "manual_payment_refunded",
            status: "refunded",
            amount: null,
            method: "cash",
            provider: "manual",
            reason: "Estorno para validar o histórico imutável.",
            adminRole: "owner",
          },
          {
            eventType: "manual_payment_confirmed",
            status: "paid",
            amount: "109.90",
            method: "cash",
            provider: "manual",
            notes: "Teste do histórico imutável de pagamento.",
            adminRole: "owner",
          },
        ],
      });
    },
  );

  it("retorna 404 quando o pedido não existe", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue(null as never);

    const findManySpy = vi
      .spyOn(prisma.orderPaymentEvent, "findMany")
      .mockResolvedValue([] as never);

    const response = await getPaymentEvents();

    expect(response.statusCode).toBe(404);

    expect(response.json()).toMatchObject({
      error: "Not found",
      message: "Pedido não encontrado.",
    });

    expect(findManySpy).not.toHaveBeenCalled();
  });

  it("retorna lista vazia quando não há eventos", async () => {
    vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
      id: ORDER_ID,
    } as never);

    vi.spyOn(prisma.orderPaymentEvent, "findMany").mockResolvedValue(
      [] as never,
    );

    const response = await getPaymentEvents();

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual({
      data: [],
    });
  });
});
