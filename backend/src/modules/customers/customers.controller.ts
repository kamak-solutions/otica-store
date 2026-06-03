import type { FastifyReply, FastifyRequest } from "fastify";
import {
  listAdminCustomers,
  findAdminCustomerById,
  updateCustomerCrmStatus,
} from "./customers.service.js";
import { mapCustomerToHttp } from "./customers.mapper.js";
import { AppError } from "../../errors/app-error.js";


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
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

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
    Params: {
      id: string;
    };
    Body: {
      crmStatus: string;
    };
  }>,
  reply: FastifyReply,
) {
  const customer = await updateCustomerCrmStatus(
    request.params.id,
    request.body.crmStatus,
  );

  return reply.send({
    data: mapCustomerToHttp(customer),
  });
}