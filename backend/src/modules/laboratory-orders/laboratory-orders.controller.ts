import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

import {
  createLaboratoryOrder,
  findLaboratoryOrderById,
  listLaboratoryOrders,
  updateLaboratoryOrderStatus,
} from "./laboratory-orders.service.js";

import {
  createLaboratoryOrderBodySchema,
  laboratoryOrderIdParamsSchema,
  updateLaboratoryOrderStatusBodySchema,
  type CreateLaboratoryOrderBody,
  type LaboratoryOrderIdParams,
  type UpdateLaboratoryOrderStatusBody,
} from "./laboratory-orders.schemas.js";

type LaboratoryOrderResult = NonNullable<
  Awaited<ReturnType<typeof findLaboratoryOrderById>>
>;

function mapLaboratoryOrderToHttp(
  laboratoryOrder: LaboratoryOrderResult,
) {
  return {
    id: laboratoryOrder.id,

    status: laboratoryOrder.status,
    externalOrderNumber: laboratoryOrder.externalOrderNumber,

    order: {
      id: laboratoryOrder.order.id,
      orderNumber: laboratoryOrder.order.orderNumber,
      status: laboratoryOrder.order.status,
      subtotal: laboratoryOrder.order.subtotal.toFixed(2),

      customer: {
        id: laboratoryOrder.order.customer.id,
        name: laboratoryOrder.order.customer.name,
        email: laboratoryOrder.order.customer.email,
        phone: laboratoryOrder.order.customer.phone,
      },

      items: laboratoryOrder.order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice.toFixed(2),
        quantity: item.quantity,
      })),
    },

    laboratory: {
      id: laboratoryOrder.laboratory.id,
      code: laboratoryOrder.laboratory.code,
      name: laboratoryOrder.laboratory.name,
      contactName: laboratoryOrder.laboratory.contactName,
      phone: laboratoryOrder.laboratory.phone,
      whatsapp: laboratoryOrder.laboratory.whatsapp,
      email: laboratoryOrder.laboratory.email,
      averageDeliveryDays:
        laboratoryOrder.laboratory.averageDeliveryDays,
      acceptsApi: laboratoryOrder.laboratory.acceptsApi,
    },

    prescription: laboratoryOrder.prescription
      ? {
          id: laboratoryOrder.prescription.id,
          customerId: laboratoryOrder.prescription.customerId,

          examDate:
            laboratoryOrder.prescription.examDate?.toISOString() ??
            null,

          expiresAt:
            laboratoryOrder.prescription.expiresAt?.toISOString() ??
            null,

          rightSpherical:
            laboratoryOrder.prescription.rightSpherical,
          rightCylindrical:
            laboratoryOrder.prescription.rightCylindrical,
          rightAxis:
            laboratoryOrder.prescription.rightAxis,

          leftSpherical:
            laboratoryOrder.prescription.leftSpherical,
          leftCylindrical:
            laboratoryOrder.prescription.leftCylindrical,
          leftAxis:
            laboratoryOrder.prescription.leftAxis,

          addition:
            laboratoryOrder.prescription.addition,

          pupillaryDistance:
            laboratoryOrder.prescription.pupillaryDistance,

          height:
            laboratoryOrder.prescription.height,

          doctorName:
            laboratoryOrder.prescription.doctorName,

          doctorCrm:
            laboratoryOrder.prescription.doctorCrm,
        }
      : null,

    createdByAdmin: laboratoryOrder.createdByAdmin
      ? {
          id: laboratoryOrder.createdByAdmin.id,
          name: laboratoryOrder.createdByAdmin.name,
          email: laboratoryOrder.createdByAdmin.email,
          role: laboratoryOrder.createdByAdmin.role,
        }
      : null,

    sentAt: laboratoryOrder.sentAt?.toISOString() ?? null,
    expectedAt:
      laboratoryOrder.expectedAt?.toISOString() ?? null,
    receivedAt:
      laboratoryOrder.receivedAt?.toISOString() ?? null,
    deliveredAt:
      laboratoryOrder.deliveredAt?.toISOString() ?? null,

    notes: laboratoryOrder.notes,

    createdAt: laboratoryOrder.createdAt.toISOString(),
    updatedAt: laboratoryOrder.updatedAt.toISOString(),
  };
}

export async function getLaboratoryOrdersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing laboratory orders");

  const laboratoryOrders = await listLaboratoryOrders();

  return reply.send({
    data: laboratoryOrders.map(mapLaboratoryOrderToHttp),
  });
}

export async function getLaboratoryOrderByIdController(
  request: FastifyRequest<{
    Params: LaboratoryOrderIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = laboratoryOrderIdParamsSchema.parse(
    request.params,
  );

  const laboratoryOrder =
    await findLaboratoryOrderById(id);

  if (!laboratoryOrder) {
    throw new AppError(
      "Pedido laboratorial não encontrado.",
      404,
      "Not found",
    );
  }

  return reply.send({
    data: mapLaboratoryOrderToHttp(laboratoryOrder),
  });
}

export async function createLaboratoryOrderController(
  request: FastifyRequest<{
    Body: CreateLaboratoryOrderBody;
  }>,
  reply: FastifyReply,
) {
  const body = createLaboratoryOrderBodySchema.parse(
    request.body,
  );

  const laboratoryOrder = await createLaboratoryOrder({
    ...body,
    createdByAdminId: request.admin?.sub,
  });

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "laboratory_order.created",
    entity: "LaboratoryOrder",
    entityId: laboratoryOrder.id,
    metadata: {
      orderId: laboratoryOrder.orderId,
      laboratoryId: laboratoryOrder.laboratoryId,
      prescriptionId: laboratoryOrder.prescriptionId,
      status: laboratoryOrder.status,
    },
  });

  return reply.status(201).send({
    data: mapLaboratoryOrderToHttp(laboratoryOrder),
    message: "Pedido laboratorial criado com sucesso.",
  });
}

export async function updateLaboratoryOrderStatusController(
  request: FastifyRequest<{
    Params: LaboratoryOrderIdParams;
    Body: UpdateLaboratoryOrderStatusBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = laboratoryOrderIdParamsSchema.parse(
    request.params,
  );

  const body =
    updateLaboratoryOrderStatusBodySchema.parse(request.body);

  const laboratoryOrder =
    await updateLaboratoryOrderStatus(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "laboratory_order.status_updated",
    entity: "LaboratoryOrder",
    entityId: laboratoryOrder.id,
    metadata: {
      status: laboratoryOrder.status,
      externalOrderNumber:
        laboratoryOrder.externalOrderNumber,
    },
  });

  return reply.send({
    data: mapLaboratoryOrderToHttp(laboratoryOrder),
    message:
      "Status do pedido laboratorial atualizado com sucesso.",
  });
}
