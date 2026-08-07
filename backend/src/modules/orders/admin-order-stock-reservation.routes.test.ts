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

const ADMIN_ID = "22222222-2222-4222-8222-222222222222";
const CUSTOMER_ID = "33333333-3333-4333-8333-333333333333";
const PRODUCT_ID = "44444444-4444-4444-8444-444444444444";
const ORDER_ID = "55555555-5555-4555-8555-555555555555";

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

function createOrder() {
  return {
    id: ORDER_ID,
    orderNumber: "OSR-123456",
    customerId: CUSTOMER_ID,
    attendanceId: null,
    createdByAdminId: ADMIN_ID,
    status: "pending",
    subtotal: {
      toFixed: () => "219.80",
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
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
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
    items: [
      {
        id: "66666666-6666-4666-8666-666666666666",
        orderId: ORDER_ID,
        productId: PRODUCT_ID,
        productName: "Armação Teste",
        unitPrice: {
          toFixed: () => "109.90",
        },
        quantity: 2,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ],
  };
}

async function postAdminOrder() {
  mockActiveAdmin();

  return app.inject({
    method: "POST",
    url: "/admin/orders",
    headers: {
      authorization: `Bearer ${createToken()}`,
    },
    payload: {
      customerId: CUSTOMER_ID,
      items: [
        {
          productId: PRODUCT_ID,
          quantity: 2,
        },
      ],
    },
  });
}

describe("POST /admin/orders stock reservation", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("reserva estoque e registra movimentação", async () => {
    const productUpdateSpy = vi.fn().mockResolvedValue({});
    const stockMovementCreateSpy = vi.fn().mockResolvedValue({});
    const orderCreateSpy = vi.fn().mockResolvedValue(createOrder());

    vi.spyOn(prisma, "$transaction").mockImplementation(
      async (callback: any) => {
        return callback({
          customer: {
            findUnique: vi.fn().mockResolvedValue({
              id: CUSTOMER_ID,
            }),
          },
          product: {
            findMany: vi.fn().mockResolvedValue([
              {
                id: PRODUCT_ID,
                name: "Armação Teste",
                price: 109.9,
                salePrice: null,
                stock: 5,
                reservedStock: 1,
                active: true,
              },
            ]),
            update: productUpdateSpy,
          },
          order: {
            create: orderCreateSpy,
          },
          stockMovement: {
            create: stockMovementCreateSpy,
          },
          customerAttendance: {
            findUnique: vi.fn(),
            update: vi.fn(),
          },
        });
      },
    );

    vi.spyOn(prisma.adminAuditLog, "create").mockResolvedValue({} as never);

    const response = await postAdminOrder();

    expect(response.statusCode).toBe(201);

    expect(productUpdateSpy).toHaveBeenCalledWith({
      where: {
        id: PRODUCT_ID,
      },
      data: {
        reservedStock: {
          increment: 2,
        },
      },
    });

    expect(stockMovementCreateSpy).toHaveBeenCalledWith({
      data: expect.objectContaining({
        productId: PRODUCT_ID,
        orderId: ORDER_ID,
        movementType: "order_reservation",
        quantity: 2,
        stockBefore: 5,
        stockAfter: 5,
        reservedBefore: 1,
        reservedAfter: 3,
        adminId: ADMIN_ID,
      }),
    });
  });

  it("bloqueia quando o estoque disponível é insuficiente", async () => {
    const orderCreateSpy = vi.fn();
    const productUpdateSpy = vi.fn();
    const stockMovementCreateSpy = vi.fn();

    vi.spyOn(prisma, "$transaction").mockImplementation(
      async (callback: any) => {
        return callback({
          customer: {
            findUnique: vi.fn().mockResolvedValue({
              id: CUSTOMER_ID,
            }),
          },
          product: {
            findMany: vi.fn().mockResolvedValue([
              {
                id: PRODUCT_ID,
                name: "Armação Teste",
                price: 109.9,
                salePrice: null,
                stock: 3,
                reservedStock: 2,
                active: true,
              },
            ]),
            update: productUpdateSpy,
          },
          order: {
            create: orderCreateSpy,
          },
          stockMovement: {
            create: stockMovementCreateSpy,
          },
          customerAttendance: {
            findUnique: vi.fn(),
            update: vi.fn(),
          },
        });
      },
    );

    const response = await postAdminOrder();

    expect(response.statusCode).toBe(400);

    expect(response.json()).toMatchObject({
      error: "Bad Request",
      message: "Estoque disponível insuficiente para o produto Armação Teste.",
    });

    expect(orderCreateSpy).not.toHaveBeenCalled();
    expect(productUpdateSpy).not.toHaveBeenCalled();
    expect(stockMovementCreateSpy).not.toHaveBeenCalled();
  });
});
