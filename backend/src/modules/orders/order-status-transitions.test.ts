import { describe, expect, it } from "vitest";

import type { OrderStatus } from "./orders.schemas.js";

import {
  allowedOrderStatusTransitions,
  isOrderStatusTransitionAllowed,
} from "./orders.service.js";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];

describe("Transições de status do pedido", () => {
  it.each([
    ["pending", "confirmed"],
    ["pending", "cancelled"],
    ["confirmed", "preparing"],
    ["confirmed", "cancelled"],
    ["preparing", "delivered"],
    ["preparing", "cancelled"],
  ] satisfies Array<[OrderStatus, OrderStatus]>)(
    "permite a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isOrderStatusTransitionAllowed(
          currentStatus,
          nextStatus,
        ),
      ).toBe(true);
    },
  );

  it.each([
    ["pending", "preparing"],
    ["pending", "delivered"],
    ["confirmed", "pending"],
    ["confirmed", "delivered"],
    ["preparing", "pending"],
    ["preparing", "confirmed"],
    ["delivered", "preparing"],
    ["cancelled", "confirmed"],
  ] satisfies Array<[OrderStatus, OrderStatus]>)(
    "bloqueia a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isOrderStatusTransitionAllowed(
          currentStatus,
          nextStatus,
        ),
      ).toBe(false);
    },
  );

  it("não permite alterar pedido entregue", () => {
    for (const nextStatus of statuses) {
      expect(
        isOrderStatusTransitionAllowed(
          "delivered",
          nextStatus,
        ),
      ).toBe(false);
    }
  });

  it("não permite alterar pedido cancelado", () => {
    for (const nextStatus of statuses) {
      expect(
        isOrderStatusTransitionAllowed(
          "cancelled",
          nextStatus,
        ),
      ).toBe(false);
    }
  });

  it("não permite manter o mesmo status", () => {
    for (const status of statuses) {
      expect(
        isOrderStatusTransitionAllowed(status, status),
      ).toBe(false);
    }
  });

  it("mantém o mapa completo de transições", () => {
    expect(allowedOrderStatusTransitions).toEqual({
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["delivered", "cancelled"],
      delivered: [],
      cancelled: [],
    });
  });
});