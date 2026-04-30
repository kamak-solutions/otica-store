import type { FastifyReply, FastifyRequest } from "fastify";
import { listCategories } from "./categories.service.js";

export async function getCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing categories");

  const categories = await listCategories();

  return reply.send({
    data: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      active: category.active,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    })),
  });
}
