import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

import {
  createSupplier,
  deactivateSupplier,
  findSupplierById,
  listSuppliers,
  updateSupplier,
} from "./suppliers.service.js";

import {
  createSupplierBodySchema,
  supplierIdParamsSchema,
  updateSupplierBodySchema,
  type CreateSupplierBody,
  type SupplierIdParams,
  type UpdateSupplierBody,
} from "./suppliers.schemas.js";

function mapSupplierToHttp(
  supplier: Awaited<ReturnType<typeof createSupplier>>,
) {
  return {
    id: supplier.id,
    code: supplier.code,
    name: supplier.name,
    contactName: supplier.contactName,
    phone: supplier.phone,
    email: supplier.email,
    active: supplier.active,
    createdAt: supplier.createdAt.toISOString(),
    updatedAt: supplier.updatedAt.toISOString(),
  };
}

export async function getSuppliersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing suppliers");

  const suppliers = await listSuppliers();

  return reply.send({
    data: suppliers.map(mapSupplierToHttp),
  });
}

export async function getSupplierByIdController(
  request: FastifyRequest<{
    Params: SupplierIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = supplierIdParamsSchema.parse(request.params);

  const supplier = await findSupplierById(id);

  if (!supplier) {
    throw new AppError(
      "Fornecedor não encontrado.",
      404,
      "Not found",
    );
  }

  return reply.send({
    data: mapSupplierToHttp(supplier),
  });
}

export async function createSupplierController(
  request: FastifyRequest<{
    Body: CreateSupplierBody;
  }>,
  reply: FastifyReply,
) {
  const body = createSupplierBodySchema.parse(request.body);

  const supplier = await createSupplier(body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "supplier.created",
    entity: "Supplier",
    entityId: supplier.id,
    metadata: {
      code: supplier.code,
      name: supplier.name,
    },
  });

  return reply.status(201).send({
    data: mapSupplierToHttp(supplier),
    message: "Fornecedor criado com sucesso.",
  });
}

export async function updateSupplierController(
  request: FastifyRequest<{
    Params: SupplierIdParams;
    Body: UpdateSupplierBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = supplierIdParamsSchema.parse(request.params);
  const body = updateSupplierBodySchema.parse(request.body);

  const supplier = await updateSupplier(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "supplier.updated",
    entity: "Supplier",
    entityId: supplier.id,
    metadata: {
      fields: Object.keys(body),
      code: supplier.code,
      name: supplier.name,
    },
  });

  return reply.send({
    data: mapSupplierToHttp(supplier),
    message: "Fornecedor atualizado com sucesso.",
  });
}

export async function deleteSupplierController(
  request: FastifyRequest<{
    Params: SupplierIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = supplierIdParamsSchema.parse(request.params);

  const supplier = await deactivateSupplier(id);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "supplier.deactivated",
    entity: "Supplier",
    entityId: supplier.id,
    metadata: {
      code: supplier.code,
      name: supplier.name,
    },
  });

  return reply.send({
    data: mapSupplierToHttp(supplier),
    message: "Fornecedor desativado com sucesso.",
  });
}