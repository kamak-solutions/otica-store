import type { FastifyReply, FastifyRequest } from "fastify";

import { blogService } from "./blog.service.js";

import { blogPostSchema } from "./blog.schemas.js";

class BlogController {
  async listPublic(_request: FastifyRequest, reply: FastifyReply) {
    const posts = await blogService.listPublic();

    return reply.send(posts);
  }

  async listAdmin(_request: FastifyRequest, reply: FastifyReply) {
    const posts = await blogService.listAdmin();

    return reply.send(posts);
  }

  async findBySlug(
    request: FastifyRequest<{
      Params: {
        slug: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const post = await blogService.findBySlug(request.params.slug);

    return reply.send(post);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = blogPostSchema.parse(request.body);

    const post = await blogService.create(data);

    return reply.status(201).send(post);
  }
  async update(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const data = blogPostSchema.parse(request.body);

    const post = await blogService.update(request.params.id, data);

    return reply.send(post);
  }

  async delete(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    await blogService.delete(request.params.id);

    return reply.status(204).send();
  }
  async findById(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const post = await blogService.findById(request.params.id);

    return reply.send(post);
  }
}

export const blogController = new BlogController();
