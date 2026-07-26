import { afterEach, describe, expect, it, vi } from "vitest";

import { prisma } from "../../lib/prisma.js";

import { updateLaboratoryOrderStatus } from "./laboratory-orders.service.js";

describe("Transação do pedido laboratorial", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("atualiza o pedido comercial e o pedido laboratorial na mesma transação", async () => {
    vi.useFakeTimers();

    const currentDate = new Date("2026-07-26T14:00:00.000Z");

    vi.setSystemTime(currentDate);

    const laboratoryOrderId = "f9d88f91-f88e-4928-86f4-16d5a9cc8387";

    const orderId = "560edf8e-4e5d-43df-abee-9c2781cbe1f1";

    vi.spyOn(prisma.laboratoryOrder, "findUnique").mockResolvedValue({
      id: laboratoryOrderId,
      orderId,
      status: "mounted",
    } as never);

    const orderUpdate = vi.fn().mockResolvedValue({
      id: orderId,
      status: "delivered",
    });

    const laboratoryOrderUpdate = vi.fn().mockResolvedValue({
      id: laboratoryOrderId,
      orderId,
      status: "delivered",
      deliveredAt: currentDate,
    });

    const transactionClient = {
      order: {
        update: orderUpdate,
      },

      laboratoryOrder: {
        update: laboratoryOrderUpdate,
      },
    };

    vi.spyOn(prisma, "$transaction").mockImplementation((async (
      callback: unknown,
    ) => {
      if (typeof callback !== "function") {
        throw new Error("Este teste espera uma transação interativa.");
      }

      return callback(transactionClient);
    }) as never);

    const result = await updateLaboratoryOrderStatus(laboratoryOrderId, {
      status: "delivered",
      externalOrderNumber: undefined,
      notes: undefined,
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    expect(orderUpdate).toHaveBeenCalledWith({
      where: {
        id: orderId,
      },
      data: {
        status: "delivered",
        externalOrderNumber: undefined,
        notes: undefined,
      },
    });

    expect(laboratoryOrderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: laboratoryOrderId,
        },

        data: expect.objectContaining({
          status: "delivered",
          deliveredAt: currentDate,
        }),
      }),
    );

    expect(result).toMatchObject({
      id: laboratoryOrderId,
      orderId,
      status: "delivered",
      deliveredAt: currentDate,
    });
  });

  it("não inicia transação quando a mudança de status é inválida", async () => {
    const laboratoryOrderId = "f9d88f91-f88e-4928-86f4-16d5a9cc8387";

    vi.spyOn(prisma.laboratoryOrder, "findUnique").mockResolvedValue({
      id: laboratoryOrderId,
      orderId: "560edf8e-4e5d-43df-abee-9c2781cbe1f1",
      status: "delivered",
    } as never);

    const transactionSpy = vi.spyOn(prisma, "$transaction");

    await expect(
      updateLaboratoryOrderStatus(laboratoryOrderId, {
        status: "pending",
        externalOrderNumber: undefined,
        notes: undefined,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
    });

    expect(transactionSpy).not.toHaveBeenCalled();
  });
});
