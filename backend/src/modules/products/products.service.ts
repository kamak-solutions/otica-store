import { prisma } from "../../lib/prisma.js";

export async function listProducts() {
  return prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      active: true,
    },
  });
}