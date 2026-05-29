import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createCustomerReminder,
  listCustomerReminders,
  completeCustomerReminder,
} from "./crm-reminders.service.js";

import {
  customerReminderParamsSchema,
  reminderIdParamsSchema,
  createCustomerReminderBodySchema,
  type CustomerReminderParams,
  type ReminderIdParams,
  type CreateCustomerReminderBody,
} from "./crm-reminders.schemas.js";

export async function getCustomerRemindersController(
  request: FastifyRequest<{
    Params: CustomerReminderParams;
  }>,
  reply: FastifyReply,
) {
  const { customerId } = customerReminderParamsSchema.parse(
    request.params,
  );

  const reminders = await listCustomerReminders(customerId);

  return reply.send({
    data: reminders,
  });
}

export async function createCustomerReminderController(
  request: FastifyRequest<{
    Params: CustomerReminderParams;
    Body: CreateCustomerReminderBody;
  }>,
  reply: FastifyReply,
) {
  const { customerId } = customerReminderParamsSchema.parse(
    request.params,
  );

  const { type, title, dueDate } =
    createCustomerReminderBodySchema.parse(
      request.body,
    );

  const reminder = await createCustomerReminder(
    customerId,
    type,
    title,
    dueDate,
  );

  return reply.status(201).send({
    data: reminder,
  });
}

export async function completeCustomerReminderController(
  request: FastifyRequest<{
    Params: ReminderIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = reminderIdParamsSchema.parse(
    request.params,
  );

  const reminder = await completeCustomerReminder(id);

  return reply.send({
    data: reminder,
  });
}