import type { FastifyReply, FastifyRequest } from "fastify";

import { createCustomerNote, listCustomerNotes } from "./crm.service.js";

import { mapCustomerNoteToHttp } from "./crm.mapper.js";
import { getCrmDashboard } from "./crm.service.js";

export async function getCustomerNotesController(
  request: FastifyRequest<{
    Params: {
      customerId: string;
    };
  }>,
  reply: FastifyReply,
) {
  const notes = await listCustomerNotes(request.params.customerId);

  return reply.send({
    data: notes.map(mapCustomerNoteToHttp),
  });
}

export async function createCustomerNoteController(
  request: FastifyRequest<{
    Params: {
      customerId: string;
    };
    Body: {
      note: string;
    };
  }>,
  reply: FastifyReply,
) {
  const note = await createCustomerNote(
    request.params.customerId,
    request.body.note,
  );

  return reply.status(201).send({
    data: mapCustomerNoteToHttp(note),
  });
}
export async function getCrmDashboardController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const dashboard = await getCrmDashboard();

  return reply.send({
    data: dashboard,
  });
}
