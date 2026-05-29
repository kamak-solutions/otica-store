import { prisma } from "../../lib/prisma.js";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

class BlogService {
  async listPublic() {
    return prisma.blogPost.findMany({
      where: {
        published: true,
        deletedAt: null,
      },

      orderBy: {
        publishedAt: "desc",
      },
    });
  }

  async listAdmin() {
    return prisma.blogPost.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: {
        slug,
        deletedAt: null,
        published: true,
      },
    });
  }

  async create(data: any) {
    return prisma.blogPost.create({
      data: {
        ...data,

        slug: generateSlug(data.title),

        publishedAt: data.published
          ? new Date()
          : null,
      },
    });
  }

  async delete(id: string) {
    return prisma.blogPost.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const blogService =
  new BlogService();