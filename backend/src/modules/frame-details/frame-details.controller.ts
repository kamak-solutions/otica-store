import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

import {
  createFrameDetails,
  findFrameDetailsByProductId,
  updateFrameDetails,
} from "./frame-details.service.js";

import {
  createFrameDetailsBodySchema,
  productFrameDetailsParamsSchema,
  updateFrameDetailsBodySchema,
  type CreateFrameDetailsBody,
  type ProductFrameDetailsParams,
  type UpdateFrameDetailsBody,
} from "./frame-details.schemas.js";

function mapFrameDetailsToAdminHttp(
  frameDetails: NonNullable<
    Awaited<ReturnType<typeof findFrameDetailsByProductId>>
  >,
) {
  return {
    id: frameDetails.id,
    productId: frameDetails.productId,

    supplier: {
      id: frameDetails.supplier.id,
      code: frameDetails.supplier.code,
      name: frameDetails.supplier.name,
      active: frameDetails.supplier.active,
    },

    collection: frameDetails.collection
      ? {
          id: frameDetails.collection.id,
          code: frameDetails.collection.code,
          name: frameDetails.collection.name,
          active: frameDetails.collection.active,
        }
      : null,

    supplierCode: frameDetails.supplierCode,
    internalCode: frameDetails.internalCode,
    modelCode: frameDetails.modelCode,
    publicBrand: frameDetails.publicBrand,

    audience: frameDetails.audience,
    material: frameDetails.material,
    shape: frameDetails.shape,

    primaryColor: frameDetails.primaryColor,
    secondaryColor: frameDetails.secondaryColor,
    finish: frameDetails.finish,

    size: {
      label: frameDetails.sizeLabel,
      lensWidth: frameDetails.lensWidth,
      bridgeWidth: frameDetails.bridgeWidth,
      templeLength: frameDetails.templeLength,
    },

    createdAt: frameDetails.createdAt.toISOString(),
    updatedAt: frameDetails.updatedAt.toISOString(),
  };
}

export async function getFrameDetailsByProductController(
  request: FastifyRequest<{
    Params: ProductFrameDetailsParams;
  }>,
  reply: FastifyReply,
) {
  const { productId } = productFrameDetailsParamsSchema.parse(
    request.params,
  );

  const frameDetails =
    await findFrameDetailsByProductId(productId);

  if (!frameDetails) {
    throw new AppError(
      "Detalhes da armação não encontrados.",
      404,
      "Not found",
    );
  }

  return reply.send({
    data: mapFrameDetailsToAdminHttp(frameDetails),
  });
}

export async function createFrameDetailsController(
  request: FastifyRequest<{
    Params: ProductFrameDetailsParams;
    Body: CreateFrameDetailsBody;
  }>,
  reply: FastifyReply,
) {
  const { productId } = productFrameDetailsParamsSchema.parse(
    request.params,
  );

  const body = createFrameDetailsBodySchema.parse(request.body);

  const frameDetails = await createFrameDetails(productId, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "frame_details.created",
    entity: "FrameDetails",
    entityId: frameDetails.id,
    metadata: {
      productId,
      supplierId: frameDetails.supplierId,
      collectionId: frameDetails.collectionId,
      internalCode: frameDetails.internalCode,
      modelCode: frameDetails.modelCode,
    },
  });

  return reply.status(201).send({
    data: mapFrameDetailsToAdminHttp(frameDetails),
    message: "Detalhes da armação criados com sucesso.",
  });
}

export async function updateFrameDetailsController(
  request: FastifyRequest<{
    Params: ProductFrameDetailsParams;
    Body: UpdateFrameDetailsBody;
  }>,
  reply: FastifyReply,
) {
  const { productId } = productFrameDetailsParamsSchema.parse(
    request.params,
  );

  const body = updateFrameDetailsBodySchema.parse(request.body);

  const frameDetails = await updateFrameDetails(productId, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "frame_details.updated",
    entity: "FrameDetails",
    entityId: frameDetails.id,
    metadata: {
      productId,
      fields: Object.keys(body),
      internalCode: frameDetails.internalCode,
      modelCode: frameDetails.modelCode,
    },
  });

  return reply.send({
    data: mapFrameDetailsToAdminHttp(frameDetails),
    message: "Detalhes da armação atualizados com sucesso.",
  });
}
