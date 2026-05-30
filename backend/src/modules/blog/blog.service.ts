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

      include: {
        category: true,
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
      include: {
        category: true,
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
      include: {
        category: true,
      },
    });
  }

  async create(data: any) {
    return prisma.blogPost.create({
      data: {
        title: data.title,

        slug: generateSlug(data.title),

        excerpt: data.excerpt,

        content: data.content,

        imageUrl: data.imageUrl,

        cloudinaryPublicId: data.cloudinaryPublicId,

        categoryId: data.categoryId,

        readingTime: data.readingTime,

        featured: data.featured ?? false,

        published: data.published,

        publishedAt: data.published ? new Date() : null,
      },

      include: {
        category: true,
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

export const blogService = new BlogService();
