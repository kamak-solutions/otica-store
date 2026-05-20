import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateStorefrontHeroSlideBody,
  UpdateStorefrontHeroSlideBody,
} from "./storefront.schemas.js";

export async function listPublicHeroSlides() {
  return prisma.storefrontHeroSlide.findMany({
    where: {
      active: true,
    },
    orderBy: {
      position: "asc",
    },
  });
}

export async function listAdminHeroSlides() {
  return prisma.storefrontHeroSlide.findMany({
    orderBy: {
      position: "asc",
    },
  });
}

export async function createHeroSlide(data: CreateStorefrontHeroSlideBody) {
  return prisma.storefrontHeroSlide.create({
    data,
  });
}
export async function updateHeroSlide(
  id: string,
  data: UpdateStorefrontHeroSlideBody,
) {
  const slide = await prisma.storefrontHeroSlide.findUnique({
    where: {
      id,
    },
  });

  if (!slide) {
    throw new AppError("Slide da vitrine não encontrado.", 404, "Not found");
  }

  return prisma.storefrontHeroSlide.update({
    where: {
      id,
    },
    data,
  });
}
export async function deleteHeroSlide(id: string) {
  const slide = await prisma.storefrontHeroSlide.findUnique({
    where: {
      id,
    },
  });

  if (!slide) {
    throw new AppError("Slide da vitrine não encontrado.", 404, "Not found");
  }

  await prisma.storefrontHeroSlide.delete({
    where: {
      id,
    },
  });

  return slide;
}