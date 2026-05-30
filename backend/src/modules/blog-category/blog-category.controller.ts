import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  blogCategorySchema,
} from "./blog-category.schemas.js";

import {
  blogCategoryService,
} from "./blog-category.service.js";

class BlogCategoryController {
  async list(
    _request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const categories =
      await blogCategoryService.list();

    return reply.send(
      categories,
    );
  }

  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data =
      blogCategorySchema.parse(
        request.body,
      );

    const category =
      await blogCategoryService.create(
        data,
      );

    return reply
      .status(201)
      .send(category);
  }
}

export const blogCategoryController =
  new BlogCategoryController();