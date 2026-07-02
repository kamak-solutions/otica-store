import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import {
  createBrand,
  deactivateBrand,
  listBrands,
  updateBrand,
} from "./brands.service.js";

const createBrandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
});

const updateBrandSchema = createBrandSchema.partial();

const brandIdSchema = z.object({
  id: z.string().uuid(),
});

function mapBrand(brand: any) {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logoUrl: brand.logoUrl,
    website: brand.website,
    active: brand.active,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
  };
}

export async function getBrandsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing brands");

  const brands = await listBrands();

  return reply.send({
    data: brands.map(mapBrand),
  });
}

export async function createBrandController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createBrandSchema.parse(request.body);

  const brand = await createBrand(body);

  return reply.status(201).send({
    data: mapBrand(brand),
  });
}

export async function updateBrandController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = brandIdSchema.parse(request.params);

  const body = updateBrandSchema.parse(request.body);

  const brand = await updateBrand(id, body);

  return reply.send({
    data: mapBrand(brand),
  });
}

export async function deleteBrandController(
  request: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply,
) {
  const { id } = brandIdSchema.parse(request.params);

  request.log.info({ id }, "Deactivating brand");

  const brand = await deactivateBrand(id);

  return reply.send({
    data: mapBrand(brand),
    message: "Marca desativada com sucesso.",
  });
}