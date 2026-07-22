import type { FastifyReply, FastifyRequest } from "fastify";

import { AppError } from "../../errors/app-error.js";

import { mapCustomerToHttp } from "./customers.mapper.js";

import {
  createAdminCustomerBodySchema,
  customerIdParamsSchema,
  updateCustomerCrmStatusBodySchema,
  type CreateAdminCustomerBody,
  type CustomerIdParams,
  type UpdateCustomerCrmStatusBody,
} from "./customers.schemas.js";

import {
  createAdminCustomer,
  findAdminCustomerById,
  listAdminCustomers,
  updateCustomerCrmStatus,
} from "./customers.service.js";

export async function getAdminCustomersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin customers");

  const customers = await listAdminCustomers();

  return reply.send({
    data: customers.map(mapCustomerToHttp),
  });
}

export async function getAdminCustomerByIdController(
  request: FastifyRequest<{
    Params: CustomerIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = customerIdParamsSchema.parse(request.params);

  request.log.info({ id }, "Finding customer");

  const customer = await findAdminCustomerById(id);

  if (!customer) {
    throw new AppError("Cliente não encontrado.", 404, "Not found");
  }

  return reply.send({
    data: mapCustomerToHttp(customer),
  });
}

export async function updateCustomerCrmStatusController(
  request: FastifyRequest<{
    Params: CustomerIdParams;
    Body: UpdateCustomerCrmStatusBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = customerIdParamsSchema.parse(request.params);

  const body = updateCustomerCrmStatusBodySchema.parse(request.body);

  const customer = await updateCustomerCrmStatus(id, body.crmStatus);

  return reply.send({
    data: mapCustomerToHttp(customer),
  });
}

export async function createAdminCustomerController(
  request: FastifyRequest<{
    Body: CreateAdminCustomerBody;
  }>,
  reply: FastifyReply,
) {
  const body = createAdminCustomerBodySchema.parse(request.body);

  const customer = await createAdminCustomer(body);

  return reply.status(201).send({
    data: mapCustomerToHttp(customer),
  });
}
