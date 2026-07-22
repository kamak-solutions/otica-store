import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  createLaboratory,
  deactivateLaboratory,
  listLaboratories,
  updateLaboratory,
} from "./laboratories.service.js";

const createLaboratorySchema = z.object({
  code: z.string().trim().min(2).optional(),
  name: z.string().trim().min(2),
  companyName: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  website: z.string().trim().url().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().max(2).optional(),
  averageDeliveryDays: z.number().int().positive().optional(),
  acceptsApi: z.boolean().optional(),
  active: z.boolean().optional(),
  notes: z.string().trim().optional(),
});

const updateLaboratorySchema = createLaboratorySchema.partial();

const laboratoryIdSchema = z.object({
  id: z.string().uuid(),
});

function mapLaboratory(laboratory: any) {
  return {
    id: laboratory.id,
    code: laboratory.code,
    name: laboratory.name,
    companyName: laboratory.companyName,
    contactName: laboratory.contactName,
    phone: laboratory.phone,
    whatsapp: laboratory.whatsapp,
    email: laboratory.email,
    website: laboratory.website,
    city: laboratory.city,
    state: laboratory.state,
    averageDeliveryDays: laboratory.averageDeliveryDays,
    acceptsApi: laboratory.acceptsApi,
    notes: laboratory.notes,
    active: laboratory.active,
    createdAt: laboratory.createdAt.toISOString(),
    updatedAt: laboratory.updatedAt.toISOString(),
  };
}

export async function getLaboratoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing laboratories");

  const laboratories = await listLaboratories();

  return reply.send({
    data: laboratories.map(mapLaboratory),
  });
}

export async function createLaboratoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createLaboratorySchema.parse(request.body);

  const laboratory = await createLaboratory(body);

  return reply.status(201).send({
    data: mapLaboratory(laboratory),
  });
}

export async function updateLaboratoryController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = laboratoryIdSchema.parse(request.params);
  const body = updateLaboratorySchema.parse(request.body);

  const laboratory = await updateLaboratory(id, body);

  return reply.send({
    data: mapLaboratory(laboratory),
  });
}

export async function deleteLaboratoryController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = laboratoryIdSchema.parse(request.params);

  request.log.info({ id }, "Deactivating laboratory");

  const laboratory = await deactivateLaboratory(id);

  return reply.send({
    data: mapLaboratory(laboratory),
    message: "Laboratório desativado com sucesso.",
  });
}
