import type { FastifyReply, FastifyRequest } from "fastify";

import { campaignsService } from "./campaigns.service.js";

class CampaignsController {
  async listPublic(request: FastifyRequest, reply: FastifyReply) {
    const { location } = request.query as {
      location?: string;
    };

    const campaigns = await campaignsService.listPublic(location);

    return reply.send(campaigns);
  }
  async list(_request: FastifyRequest, reply: FastifyReply) {
    const campaigns = await campaignsService.list();

    return reply.send(campaigns);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const campaign = await campaignsService.create(request.body);

    return reply.status(201).send(campaign);
  }

  async update(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const campaign = await campaignsService.update(
      request.params.id,
      request.body,
    );

    return reply.send(campaign);
  }

  async delete(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    await campaignsService.delete(request.params.id);

    return reply.status(204).send();
  }

  async toggle(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const campaign = await campaignsService.toggle(request.params.id);

    return reply.send(campaign);
  }
}

export const campaignsController = new CampaignsController();
