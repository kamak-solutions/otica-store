import type { FastifyReply, FastifyRequest } from "fastify";
import {
  landingPageParamsSchema,
  createLandingPageSchema,
  updateLandingPageSchema,
} from "./landing-page.schema.js";
import {
  getPublicLandingPageBySlug,
  listAllLandingPages,
  getLandingPageById,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
} from "./landing-page.service.js";

export async function getPublicLandingPageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { slug } = request.params as { slug: string };
  const landingPage = await getPublicLandingPageBySlug(slug);

  if (!landingPage) {
    return reply.status(404).send({ message: "Landing page não encontrada." });
  }

  return reply.send(landingPage);
}
export async function getLandingPageByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = landingPageParamsSchema.parse(request.params);

  const landingPage = await getLandingPageById(id);

  if (!landingPage) {
    return reply.status(404).send({
      message: "Landing page não encontrada.",
    });
  }

  return reply.send({
    data: landingPage,
  });
}

export async function listLandingPagesController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const landingPages = await listAllLandingPages();
  return reply.send({ data: landingPages });
}

export async function createLandingPageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createLandingPageSchema.parse(request.body);
  const adminId = request.admin?.sub;

  const lp = await createLandingPage(body, adminId);
  return reply
    .status(201)
    .send({ data: lp, message: "Landing page criada com sucesso." });
}

export async function updateLandingPageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = landingPageParamsSchema.parse(request.params);
  const body = updateLandingPageSchema.parse(request.body);
  const adminId = request.admin?.sub;

  const updated = await updateLandingPage(id, body, adminId);
  return reply.send({
    data: updated,
    message: "Landing page atualizada com sucesso.",
  });
}

export async function deleteLandingPageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = landingPageParamsSchema.parse(request.params);
  const adminId = request.admin?.sub;

  await deleteLandingPage(id, adminId);
  return reply.status(204).send();
}
