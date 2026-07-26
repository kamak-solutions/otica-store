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
import { signAdminToken } from "../../lib/admin-jwt.js";
import { prisma } from "../../lib/prisma.js";

const ORDER_ID =
  "b890d320-16f2-477f-a6d3-8eb08f4e3dac";

const ADMIN_ID =
  "9bd99cc5-cc41-4ddb-8c80-5f897af3b411";

const ADMIN_EMAIL = "admin@oticashowroom.com";

function createToken() {
  return signAdminToken({
    sub: ADMIN_ID,
    email: ADMIN_EMAIL,
    role: "owner",
  });
}

function mockActiveAdmin() {
  vi.spyOn(prisma.adminUser, "findUnique").mockResolvedValue({
    id: ADMIN_ID,
    name: "Administrador",
    email: ADMIN_EMAIL,
    passwordHash: "hash-nao-utilizado",
    role: "owner",
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  });
}

function createOrder(status: string) {
  return {
    id: ORDER_ID,
    orderNumber: "OSR-764495",
    customerId:
      "a07db6f5-30f6-4bdc-acbd-b50b0d90ba09",
    status,
    subtotal: {
      toFixed: () => "95.50",
    },
    notes: null,

    paymentStatus: "pending",
    paymentMethod: null,
    paymentProvider: null,
    paymentProviderId: null,
    paymentUrl: null,
    paidAt: null,

    shippingMethod: null,
    shippingPrice: null,
    shippingStatus: "not_required",

    attendanceId: null,
    createdByAdminId: ADMIN_ID,

    customer: {
      id: "a07db6f5-30f6-4bdc-acbd-b50b0d90ba09",
      name: "Cliente Teste ERP",
      email: "cliente.erp.teste@example.com",
      phone: "11999998888",
      zipcode: "01001000",
      state: "SP",
      street: "Praça da Sé",
      number: "100",
      complement: null,
      district: "Sé",
      city: "São Paulo",
    },

    items: [
      {
        id: "d28375ac-bb76-4f36-91aa-c353724e9223",
        orderId: ORDER_ID,
        productId:
          "1578f40c-1b27-4e20-ac76-1baba3c769d9",
        productName: "Rose",
        unitPrice: {
          toFixed: () => "95.50",
        },
        quantity: 1,
        createdAt: new Date("2026-07-26T10:00:00.000Z"),
      },
    ],

    createdAt: new Date("2026-07-26T10:00:00.000Z"),
    updatedAt: new Date("2026-07-26T10:00:00.000Z"),
  };
}

async function patchOrderStatus(
  currentStatus: string,
  nextStatus: string,
) {
  mockActiveAdmin();

  vi.spyOn(prisma.order, "findUnique").mockResolvedValue({
    id: ORDER_ID,
    status: currentStatus,
  } as never);

  vi.spyOn(prisma.order, "update").mockResolvedValue(
    createOrder(nextStatus) as never,
  );

  vi.spyOn(
    prisma.adminAuditLog,
    "create",
  ).mockResolvedValue({} as never);

  return app.inject({
    method: "PATCH",
    url: `/admin/orders/${ORDER_ID}/status`,
    headers: {
      authorization: `Bearer ${createToken()}`,
    },
    payload: {
      status: nextStatus,
    },
  });
}

describe("Rotas de status do pedido", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("permite pending → confirmed", async () => {
    const response = await patchOrderStatus(
      "pending",
      "confirmed",
    );

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        id: ORDER_ID,
        status: "confirmed",
      },
      message: "Status do pedido atualizado com sucesso.",
    });

    expect(prisma.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: ORDER_ID,
        },
        data: {
          status: "confirmed",
        },
      }),
    );
  });

  it("bloqueia pending → delivered", async () => {
    const response = await patchOrderStatus(
      "pending",
      "delivered",
    );

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message:
        'Não é possível alterar o pedido de "pending" para "delivered".',
    });

    expect(prisma.order.update).not.toHaveBeenCalled();
    expect(prisma.adminAuditLog.create).not.toHaveBeenCalled();
  });

  it("permite confirmed → preparing", async () => {
    const response = await patchOrderStatus(
      "confirmed",
      "preparing",
    );

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        status: "preparing",
      },
    });
  });

  it("permite preparing → delivered", async () => {
    const response = await patchOrderStatus(
      "preparing",
      "delivered",
    );

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        status: "delivered",
      },
    });
  });

  it("bloqueia delivered → preparing", async () => {
    const response = await patchOrderStatus(
      "delivered",
      "preparing",
    );

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message:
        'Não é possível alterar o pedido de "delivered" para "preparing".',
    });

    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it("permite pending → cancelled", async () => {
    const response = await patchOrderStatus(
      "pending",
      "cancelled",
    );

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      data: {
        status: "cancelled",
      },
    });
  });

  it("bloqueia cancelled → confirmed", async () => {
    const response = await patchOrderStatus(
      "cancelled",
      "confirmed",
    );

    expect(response.statusCode).toBe(409);

    expect(response.json()).toMatchObject({
      error: "Conflict",
      message:
        'Não é possível alterar o pedido de "cancelled" para "confirmed".',
    });

    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it("bloqueia atualização sem autenticação", async () => {
    const response = await app.inject({
      method: "PATCH",
      url: `/admin/orders/${ORDER_ID}/status`,
      payload: {
        status: "confirmed",
      },
    });

    expect(response.statusCode).toBe(401);

    expect(response.json()).toMatchObject({
      error: "Unauthorized",
      message: "Token não informado.",
    });
  });
});