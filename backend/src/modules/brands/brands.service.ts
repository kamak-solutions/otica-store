import { prisma } from "../../lib/prisma.js";

export async function listBrands() {
  return prisma.brand.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

type CreateBrandData = {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
};

export async function createBrand(data: CreateBrandData) {
  return prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      website: data.website || null,
    },
  });
}

type UpdateBrandData = Partial<CreateBrandData>;

export async function updateBrand(id: string, data: UpdateBrandData) {
  return prisma.brand.update({
    where: { id },
    data,
  });
}

export async function deactivateBrand(id: string) {
  return prisma.brand.update({
    where: { id },
    data: {
      active: false,
    },
  });
}