import type { FastifyReply, FastifyRequest } from "fastify";
import { listProducts } from "./products.service.js";

export async function getProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing products");

  const products = await listProducts();

  return reply.send({
    data: products,
  });
}