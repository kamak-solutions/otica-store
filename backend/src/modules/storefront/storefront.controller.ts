import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createHeroSlide,
  listAdminHeroSlides,
  listPublicHeroSlides,
  updateHeroSlide,
} from "./storefront.service.js";
import {
  createStorefrontHeroSlideBodySchema,
  storefrontHeroSlideIdParamsSchema,
  updateStorefrontHeroSlideBodySchema,
  type CreateStorefrontHeroSlideBody,
  type StorefrontHeroSlideIdParams,
  type UpdateStorefrontHeroSlideBody,
} from "./storefront.schemas.js";

export async function getPublicHeroSlidesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing public storefront hero slides");

  const slides = await listPublicHeroSlides();

  return reply.send({
    data: slides,
  });
}

export async function getAdminHeroSlidesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin storefront hero slides");

  const slides = await listAdminHeroSlides();

  return reply.send({
    data: slides,
  });
}
export async function createAdminHeroSlideController(
  request: FastifyRequest<{
    Body: CreateStorefrontHeroSlideBody;
  }>,
  reply: FastifyReply,
) {
  const body = createStorefrontHeroSlideBodySchema.parse(request.body);

  request.log.info("Creating storefront hero slide");

  const slide = await createHeroSlide(body);

  return reply.status(201).send({
    data: slide,
    message: "Slide da vitrine criado com sucesso.",
  });
}
export async function updateAdminHeroSlideController(
  request: FastifyRequest<{
    Params: StorefrontHeroSlideIdParams;
    Body: UpdateStorefrontHeroSlideBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = storefrontHeroSlideIdParamsSchema.parse(request.params);
  const body = updateStorefrontHeroSlideBodySchema.parse(request.body);

  request.log.info({ id }, "Updating storefront hero slide");

  const slide = await updateHeroSlide(id, body);

  return reply.send({
    data: slide,
    message: "Slide da vitrine atualizado com sucesso.",
  });
}
