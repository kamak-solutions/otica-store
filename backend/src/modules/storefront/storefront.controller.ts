import type { FastifyReply, FastifyRequest } from "fastify";
import {
  createHeroSlide,
  deleteHeroSlide,
  getStorefrontTheme,
  listAdminBanners,
  listAdminHeroSlides,
  listPublicBanners,
  listPublicHeroSlides,
  updateBanner,
  updateHeroSlide,
  updateStorefrontTheme,
} from "./storefront.service.js";
import {
  createStorefrontHeroSlideBodySchema,
  storefrontBannerIdParamsSchema,
  storefrontHeroSlideIdParamsSchema,
  updateStorefrontBannerBodySchema,
  updateStorefrontHeroSlideBodySchema,
  updateStorefrontThemeBodySchema,
  type CreateStorefrontHeroSlideBody,
  type StorefrontBannerIdParams,
  type StorefrontHeroSlideIdParams,
  type UpdateStorefrontBannerBody,
  type UpdateStorefrontHeroSlideBody,
  type UpdateStorefrontThemeBody,
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
export async function deleteAdminHeroSlideController(
  request: FastifyRequest<{
    Params: StorefrontHeroSlideIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = storefrontHeroSlideIdParamsSchema.parse(request.params);

  request.log.info({ id }, "Deleting storefront hero slide");

  const slide = await deleteHeroSlide(id);

  return reply.send({
    data: slide,
    message: "Slide da vitrine excluído com sucesso.",
  });
}
export async function getPublicBannersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing public storefront banners");

  const banners = await listPublicBanners();

  return reply.send({
    data: banners,
  });
}

export async function getAdminBannersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin storefront banners");

  const banners = await listAdminBanners();

  return reply.send({
    data: banners,
  });
}

export async function updateAdminBannerController(
  request: FastifyRequest<{
    Params: StorefrontBannerIdParams;
    Body: UpdateStorefrontBannerBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = storefrontBannerIdParamsSchema.parse(request.params);
  const body = updateStorefrontBannerBodySchema.parse(request.body);

  request.log.info({ id }, "Updating storefront banner");

  const banner = await updateBanner(id, body);

  return reply.send({
    data: banner,
    message: "Banner da vitrine atualizado com sucesso.",
  });
}
export async function getPublicThemeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Getting public storefront theme");

  const theme = await getStorefrontTheme();

  return reply.send({
    data: theme,
  });
}

export async function getAdminThemeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Getting admin storefront theme");

  const theme = await getStorefrontTheme();

  return reply.send({
    data: theme,
  });
}

export async function updateAdminThemeController(
  request: FastifyRequest<{
    Body: UpdateStorefrontThemeBody;
  }>,
  reply: FastifyReply,
) {
  const body = updateStorefrontThemeBodySchema.parse(request.body);

  request.log.info("Updating storefront theme");

  const theme = await updateStorefrontTheme(body);

  return reply.send({
    data: theme,
    message: "Tema da vitrine atualizado com sucesso.",
  });
}