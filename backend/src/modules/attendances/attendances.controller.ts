import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  createAttendance,
  findAttendanceById,
  listAttendances,
  listAttendancesByCustomerId,
} from "./attendances.service.js";

const createAttendanceSchema = z.object({
  customerId: z.string().uuid(),

  type: z.string(),

  notes: z.string().optional(),
});

const attendanceIdSchema = z.object({
  id: z.string().uuid(),
});
const customerIdSchema = z.object({
  customerId: z.string().uuid(),
});

function mapAttendance(attendance: any) {
  return {
    id: attendance.id,

    type: attendance.type,

    status: attendance.status,

    notes: attendance.notes,

    customer: {
      id: attendance.customer.id,
      name: attendance.customer.name,
    },

    collaborator: attendance.createdByAdmin
      ? {
          id: attendance.createdByAdmin.id,
          name: attendance.createdByAdmin.name,
        }
      : null,

    createdAt: attendance.createdAt,
  };
}

export async function getAttendancesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing attendances");

  const attendances = await listAttendances();

  return reply.send({
    data: attendances.map(mapAttendance),
  });
}

export async function createAttendanceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createAttendanceSchema.parse(request.body);

  const attendance = await createAttendance({
    ...body,
    createdByAdminId: request.admin?.sub,
  });

  return reply.status(201).send({
    data: mapAttendance(attendance),
  });
}

export async function getAttendanceByIdController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { id } = attendanceIdSchema.parse(request.params);

  const attendance = await findAttendanceById(id);

  return reply.send({
    data: mapAttendance(attendance),
  });
}
export async function getCustomerAttendancesController(
  request: FastifyRequest<{
    Params: {
      customerId: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { customerId } = customerIdSchema.parse(request.params);

  const attendances = await listAttendancesByCustomerId(customerId);

  return reply.send({
    data: attendances.map(mapAttendance),
  });
}