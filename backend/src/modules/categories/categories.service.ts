import { prisma } from "../../lib/prisma.js";

export async function listCategories() {
  return prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
    include: {
      parent: true,
      children: true,
    },
  });
}

type CreateCategoryData = {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
};

export async function createCategory(data: CreateCategoryData) {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId || null,
    },
    include: {
      parent: true,
      children: true,
    },
  });
}

type UpdateCategoryData = Partial<CreateCategoryData>;

export async function updateCategory(id: string, data: UpdateCategoryData) {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      ...data,
      parentId: data.parentId || null,
    },
    include: {
      parent: true,
      children: true,
    },
  });
}
export async function deactivateCategory(id: string) {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
    include: {
      parent: true,
      children: true,
    },
  });
}
