import type { FastifyReply, FastifyRequest } from "fastify";
import {
  listAdminCustomers,
  findAdminCustomerById,
  updateCustomerCrmStatus,
  createAdminCustomer,
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
export async function createAdminCustomerController(
  request: FastifyRequest<{
    Body: {
      name: string;
      email: string;
      phone: string;
      cpf?: string;
      birthDate?: string;
      zipcode: string;
      state: string;
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;
      crmStatus?: string;
      lgpdAccepted: boolean;
      lgpdConsentSource?: string;
    };
  }>,
  reply: FastifyReply,
) {
  const customer = await createAdminCustomer(request.body);

  return reply.status(201).send({
    data: mapCustomerToHttp(customer),
  });
}
