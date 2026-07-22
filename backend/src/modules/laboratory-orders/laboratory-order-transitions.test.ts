import { describe, expect, it } from "vitest";

import type { LaboratoryOrderStatus } from "../../modules/laboratory-orders/laboratory-orders.schemas.js";

import {
  allowedLaboratoryOrderTransitions,
  isLaboratoryOrderTransitionAllowed,
} from "../../modules/laboratory-orders/laboratory-orders.service.js";

const statuses: LaboratoryOrderStatus[] = [
  "pending",
  "sent",
  "received_by_laboratory",
  "in_production",
  "ready",
  "received_at_store",
  "mounted",
  "delivered",
];

describe("Transições do pedido laboratorial", () => {
  it.each([
    ["pending", "sent"],
    ["sent", "received_by_laboratory"],
    ["received_by_laboratory", "in_production"],
    ["in_production", "ready"],
    ["ready", "received_at_store"],
    ["received_at_store", "mounted"],
    ["mounted", "delivered"],
  ] satisfies Array<
    [LaboratoryOrderStatus, LaboratoryOrderStatus]
  >)(
    "permite a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isLaboratoryOrderTransitionAllowed(
          currentStatus,
          nextStatus,
        ),
      ).toBe(true);
    },
  );

  it.each([
    ["pending", "delivered"],
    ["sent", "pending"],
    ["sent", "ready"],
    ["received_by_laboratory", "delivered"],
    ["in_production", "sent"],
    ["ready", "in_production"],
    ["received_at_store", "ready"],
    ["mounted", "pending"],
  ] satisfies Array<
    [LaboratoryOrderStatus, LaboratoryOrderStatus]
  >)(
    "bloqueia a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isLaboratoryOrderTransitionAllowed(
          currentStatus,
          nextStatus,
        ),
      ).toBe(false);
    },
  );

  it("não permite alterar pedido entregue", () => {
    for (const nextStatus of statuses) {
      expect(
        isLaboratoryOrderTransitionAllowed(
          "delivered",
          nextStatus,
        ),
      ).toBe(false);
    }
  });

  it("cada status possui somente a próxima etapa permitida", () => {
    expect(allowedLaboratoryOrderTransitions).toEqual({
      pending: ["sent"],
      sent: ["received_by_laboratory"],
      received_by_laboratory: ["in_production"],
      in_production: ["ready"],
      ready: ["received_at_store"],
      received_at_store: ["mounted"],
      mounted: ["delivered"],
      delivered: [],
    });
  });

  it("não permite manter o mesmo status", () => {
    for (const status of statuses) {
      expect(
        isLaboratoryOrderTransitionAllowed(status, status),
      ).toBe(false);
    }
  });
});