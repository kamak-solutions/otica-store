import { prisma } from "../../lib/prisma.js";

function generateSlug(
  value: string,
) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

class BlogCategoryService {
  async list() {
    return prisma.blogCategory.findMany({
      orderBy: {
        position: "asc",
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    position?: number;
    active?: boolean;
  }) {
    return prisma.blogCategory.create({
      data: {
        ...data,

        slug: generateSlug(
          data.name,
        ),
      },
    });
  }
}

export const blogCategoryService =
  new BlogCategoryService();