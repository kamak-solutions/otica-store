import { prisma } from "../../lib/prisma.js";
import type {
  CreateProductBody,
  UpdateProductBody,
} from "./products.schemas.js";

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

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
}

export async function createProduct(data: CreateProductBody) {
  return prisma.product.create({
    data,
  });
}

export async function updateProduct(id: string, data: UpdateProductBody) {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
}
export async function deactivateProduct(id: string) {
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}
export async function listAdminProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
