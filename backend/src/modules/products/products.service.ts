import { prisma } from "../../lib/prisma.js";
import type { CreateProductBody } from "./products.schemas.js";

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

export async function createProduct(data: CreateProductBody) {
  return prisma.product.create({
    data,
  });
}