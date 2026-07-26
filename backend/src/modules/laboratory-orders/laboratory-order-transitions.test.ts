import { describe, expect, it } from "vitest";

import type { LaboratoryOrderStatus } from "./laboratory-orders.schemas.js";

import {
  allowedLaboratoryOrderTransitions,
  isLaboratoryOrderTransitionAllowed,
  mapLaboratoryStatusToOrderStatus,
} from "./laboratory-orders.service.js";

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
  ] satisfies Array<[LaboratoryOrderStatus, LaboratoryOrderStatus]>)(
    "permite a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isLaboratoryOrderTransitionAllowed(currentStatus, nextStatus),
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
  ] satisfies Array<[LaboratoryOrderStatus, LaboratoryOrderStatus]>)(
    "bloqueia a transição %s → %s",
    (currentStatus, nextStatus) => {
      expect(
        isLaboratoryOrderTransitionAllowed(currentStatus, nextStatus),
      ).toBe(false);
    },
  );

  it("não permite alterar pedido entregue", () => {
    for (const nextStatus of statuses) {
      expect(isLaboratoryOrderTransitionAllowed("delivered", nextStatus)).toBe(
        false,
      );
    }
  });
  describe("Sincronização com o pedido comercial", () => {
    it.each([
      ["pending", "pending"],
      ["sent", "confirmed"],
      ["received_by_laboratory", "confirmed"],
      ["in_production", "preparing"],
      ["ready", "preparing"],
      ["received_at_store", "preparing"],
      ["mounted", "preparing"],
      ["delivered", "preparing"],
    ] satisfies Array<
      [LaboratoryOrderStatus, "pending" | "confirmed" | "preparing"]
    >)(
      "mapeia o status laboratorial %s para %s",
      (laboratoryStatus, expectedOrderStatus) => {
        expect(mapLaboratoryStatusToOrderStatus(laboratoryStatus)).toBe(
          expectedOrderStatus,
        );
      },
    );
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
      expect(isLaboratoryOrderTransitionAllowed(status, status)).toBe(false);
    }
  });
});
