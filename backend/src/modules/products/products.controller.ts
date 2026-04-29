import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { findProductBySlug, listProducts } from "./products.service.js";
import { mapProductToHttp } from "./products.mapper.js";
import {
  getProductBySlugParamsSchema,
  type GetProductBySlugParams,
} from "./products.schemas.js";

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
  try {
    const { slug } = getProductBySlugParamsSchema.parse(request.params);

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
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        message: "Parâmetros inválidos.",
        issues: error.issues,
      });
    }

    throw error;
  }
}