import type { FastifyReply, FastifyRequest } from "fastify";
import { listAdminCustomers } from "./customers.service.js";
import { mapCustomerToHttp } from "./customers.mapper.js";

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
