import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createPrescriptionBodySchema,
  customerPrescriptionParamsSchema,
  type CreatePrescriptionBody,
  type CustomerPrescriptionParams,
} from "./prescriptions.schemas.js";

import {
  createPrescription,
  listPrescriptionsByCustomerId,
} from "./prescriptions.service.js";

type PrescriptionRecord = {
  id: string;
  customerId: string;

  examDate: Date | null;
  expiresAt: Date | null;

  rightSpherical: string | null;
  rightCylindrical: string | null;
  rightAxis: string | null;

  leftSpherical: string | null;
  leftCylindrical: string | null;
  leftAxis: string | null;

  addition: string | null;
  pupillaryDistance: string | null;
  height: string | null;

  doctorName: string | null;
  doctorCrm: string | null;

  notes: string | null;

  fileUrl: string | null;
  filePublicId: string | null;

  createdAt: Date;
  updatedAt: Date;
};

function mapPrescription(prescription: PrescriptionRecord) {
  return {
    id: prescription.id,
    customerId: prescription.customerId,

    examDate: prescription.examDate?.toISOString() ?? null,
    expiresAt: prescription.expiresAt?.toISOString() ?? null,

    rightSpherical: prescription.rightSpherical,
    rightCylindrical: prescription.rightCylindrical,
    rightAxis: prescription.rightAxis,

    leftSpherical: prescription.leftSpherical,
    leftCylindrical: prescription.leftCylindrical,
    leftAxis: prescription.leftAxis,

    addition: prescription.addition,
    pupillaryDistance: prescription.pupillaryDistance,
    height: prescription.height,

    doctorName: prescription.doctorName,
    doctorCrm: prescription.doctorCrm,

    notes: prescription.notes,

    fileUrl: prescription.fileUrl,

    createdAt: prescription.createdAt.toISOString(),
    updatedAt: prescription.updatedAt.toISOString(),
  };
}

export async function getCustomerPrescriptionsController(
  request: FastifyRequest<{
    Params: CustomerPrescriptionParams;
  }>,
  reply: FastifyReply,
) {
  const { customerId } =
    customerPrescriptionParamsSchema.parse(request.params);

  const prescriptions =
    await listPrescriptionsByCustomerId(customerId);

  return reply.send({
    data: prescriptions.map(mapPrescription),
  });
}

export async function createCustomerPrescriptionController(
  request: FastifyRequest<{
    Params: CustomerPrescriptionParams;
    Body: CreatePrescriptionBody;
  }>,
  reply: FastifyReply,
) {
  const { customerId } =
    customerPrescriptionParamsSchema.parse(request.params);

  const body = createPrescriptionBodySchema.parse(request.body);

  const prescription = await createPrescription({
    customerId,
    ...body,
  });

  return reply.status(201).send({
    data: mapPrescription(prescription),
    message: "Receita cadastrada com sucesso.",
  });
}