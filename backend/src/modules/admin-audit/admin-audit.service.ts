import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

type CreateAdminAuditLogInput = {
  adminId?: string;
  adminEmail?: string;
  adminRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createAdminAuditLog(data: CreateAdminAuditLogInput) {
  return prisma.adminAuditLog.create({
    data: {
      adminId: data.adminId ?? null,
      adminEmail: data.adminEmail ?? null,
      adminRole: data.adminRole ?? null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId ?? null,
      metadata: data.metadata ?? undefined,
    },
  });
}
export async function listAdminAuditLogs() {
  return prisma.adminAuditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}