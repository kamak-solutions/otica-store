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