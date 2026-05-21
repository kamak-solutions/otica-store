import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateStorefrontHeroSlideBody,
  UpdateStorefrontBannerBody,
  UpdateStorefrontHeroSlideBody,
  UpdateStorefrontThemeBody,
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
export async function listPublicBanners() {
  return prisma.storefrontBanner.findMany({
    where: {
      active: true,
    },
    orderBy: {
      key: "asc",
    },
  });
}

export async function listAdminBanners() {
  return prisma.storefrontBanner.findMany({
    orderBy: {
      key: "asc",
    },
  });
}

export async function updateBanner(
  id: string,
  data: UpdateStorefrontBannerBody,
) {
  const banner = await prisma.storefrontBanner.findUnique({
    where: {
      id,
    },
  });

  if (!banner) {
    throw new AppError("Banner da vitrine não encontrado.", 404, "Not found");
  }

  return prisma.storefrontBanner.update({
    where: {
      id,
    },
    data,
  });
}
export async function getStorefrontTheme() {
  return prisma.storefrontTheme.upsert({
    where: {
      key: "default",
    },
    update: {},
    create: {
      key: "default",
    },
  });
}

export async function updateStorefrontTheme(data: UpdateStorefrontThemeBody) {
  return prisma.storefrontTheme.upsert({
    where: {
      key: "default",
    },
    update: data,
    create: {
      key: "default",
      ...data,
    },
  });
}