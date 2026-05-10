type AdminAuditLogToHttp = {
  id: string;
  adminId: string | null;
  adminEmail: string | null;
  adminRole: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  createdAt: Date;
};

export function mapAdminAuditLogToHttp(log: AdminAuditLogToHttp) {
  return {
    id: log.id,
    adminId: log.adminId,
    adminEmail: log.adminEmail,
    adminRole: log.adminRole,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    metadata: log.metadata,
    createdAt: log.createdAt.toISOString(),
  };
}