import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  createCategory,
  listCategories,
  updateCategory,
  deactivateCategory,
} from "./categories.service.js";

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const categoryIdSchema = z.object({
  id: z.string().uuid(),
});

function mapCategory(category: any) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    active: category.active,

    parent: category.parent
      ? {
          id: category.parent.id,
          name: category.parent.name,
        }
      : null,

    children:
      category.children?.map((child: any) => ({
        id: child.id,
        name: child.name,
      })) ?? [],

    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export async function getCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing categories");

  const categories = await listCategories();

  return reply.send({
    data: categories.map(mapCategory),
  });
}

export async function createCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createCategorySchema.parse(request.body);

  const category = await createCategory(body);

  return reply.status(201).send({
    data: mapCategory(category),
  });
}

export async function updateCategoryController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = categoryIdSchema.parse(request.params);

  const body = updateCategorySchema.parse(request.body);

  const category = await updateCategory(id, body);

  return reply.send({
    data: mapCategory(category),
  });
}
export async function deleteCategoryController(
  request: FastifyRequest<{
    Params: {
      id: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  request.log.info({ id }, "Deactivating category");

  const category = await deactivateCategory(id);

  return reply.send({
    data: category,
    message: "Categoria desativada com sucesso.",
  });
}
