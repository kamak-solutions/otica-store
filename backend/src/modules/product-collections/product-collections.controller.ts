import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

import {
  createProductCollection,
  deactivateProductCollection,
  findProductCollectionById,
  listProductCollections,
  updateProductCollection,
} from "./product-collections.service.js";

import {
  createProductCollectionBodySchema,
  productCollectionIdParamsSchema,
  updateProductCollectionBodySchema,
  type CreateProductCollectionBody,
  type ProductCollectionIdParams,
  type UpdateProductCollectionBody,
} from "./product-collections.schemas.js";

function mapProductCollectionToHttp(
  collection: Awaited<ReturnType<typeof createProductCollection>>,
) {
  return {
    id: collection.id,
    code: collection.code,
    name: collection.name,
    description: collection.description,
    active: collection.active,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}

export async function getProductCollectionsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing product collections");

  const collections = await listProductCollections();

  return reply.send({
    data: collections.map(mapProductCollectionToHttp),
  });
}

export async function getProductCollectionByIdController(
  request: FastifyRequest<{
    Params: ProductCollectionIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = productCollectionIdParamsSchema.parse(request.params);

  const collection = await findProductCollectionById(id);

  if (!collection) {
    throw new AppError(
      "Coleção não encontrada.",
      404,
      "Not found",
    );
  }

  return reply.send({
    data: mapProductCollectionToHttp(collection),
  });
}

export async function createProductCollectionController(
  request: FastifyRequest<{
    Body: CreateProductCollectionBody;
  }>,
  reply: FastifyReply,
) {
  const body = createProductCollectionBodySchema.parse(request.body);

  const collection = await createProductCollection(body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product_collection.created",
    entity: "ProductCollection",
    entityId: collection.id,
    metadata: {
      code: collection.code,
      name: collection.name,
    },
  });

  return reply.status(201).send({
    data: mapProductCollectionToHttp(collection),
    message: "Coleção criada com sucesso.",
  });
}

export async function updateProductCollectionController(
  request: FastifyRequest<{
    Params: ProductCollectionIdParams;
    Body: UpdateProductCollectionBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = productCollectionIdParamsSchema.parse(request.params);
  const body = updateProductCollectionBodySchema.parse(request.body);

  const collection = await updateProductCollection(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product_collection.updated",
    entity: "ProductCollection",
    entityId: collection.id,
    metadata: {
      fields: Object.keys(body),
      code: collection.code,
      name: collection.name,
    },
  });

  return reply.send({
    data: mapProductCollectionToHttp(collection),
    message: "Coleção atualizada com sucesso.",
  });
}

export async function deleteProductCollectionController(
  request: FastifyRequest<{
    Params: ProductCollectionIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = productCollectionIdParamsSchema.parse(request.params);

  const collection = await deactivateProductCollection(id);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product_collection.deactivated",
    entity: "ProductCollection",
    entityId: collection.id,
    metadata: {
      code: collection.code,
      name: collection.name,
    },
  });

  return reply.send({
    data: mapProductCollectionToHttp(collection),
    message: "Coleção desativada com sucesso.",
  });
}