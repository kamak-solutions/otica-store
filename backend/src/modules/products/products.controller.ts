import type { FastifyReply, FastifyRequest } from "fastify";
import { findProductBySlug, listProducts } from "./products.service.js";
import { mapProductToHttp } from "./products.mapper.js";

type GetProductBySlugParams = {
  slug: string;
};

export async function getProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing products");

  const products = await listProducts();

  return reply.send({
    data: products.map(mapProductToHttp),
  });
}

export async function getProductBySlugController(
  request: FastifyRequest<{
    Params: GetProductBySlugParams;
  }>,
  reply: FastifyReply,
) {
  const { slug } = request.params;

  request.log.info({ slug }, "Finding product by slug");

  const product = await findProductBySlug(slug);

  if (!product) {
    return reply.status(404).send({
      error: "Product not found",
      message: "Produto não encontrado.",
    });
  }

  return reply.send({
    data: mapProductToHttp(product),
  });
}