import { prisma } from "../../lib/prisma.js";

export async function listCategories() {
  return prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
