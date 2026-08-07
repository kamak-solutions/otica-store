import { prisma } from "../../lib/prisma.js";
import { z } from "zod";
import {
  createLandingPageSchema,
  updateLandingPageSchema,
} from "./landing-page.schema.js";

export async function getPublicLandingPageBySlug(slug: string) {
  return prisma.landingPage.findFirst({
    where: { slug, active: true },
    include: {
      sections: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function listAllLandingPages() {
  return prisma.landingPage.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sections: true } } },
  });
}

export async function createLandingPage(
  data: z.infer<typeof createLandingPageSchema>,
  adminId?: string,
) {
  const slugExists = await prisma.landingPage.findUnique({
    where: { slug: data.slug },
  });
  if (slugExists) throw new Error("SLUG_EXISTS");

  return prisma.$transaction(async (tx) => {
    const lp = await tx.landingPage.create({ data });

    if (adminId) {
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: "CREATE_LANDING_PAGE",
          entity: "LandingPage",
        },
      });
    }

    return lp;
  });
}

export async function updateLandingPage(
  id: string,
  data: z.infer<typeof updateLandingPageSchema>,
  adminId?: string,
) {
  const lpExists = await prisma.landingPage.findUnique({ where: { id } });
  if (!lpExists) throw new Error("NOT_FOUND");

  if (data.slug && data.slug !== lpExists.slug) {
    const slugExists = await prisma.landingPage.findUnique({
      where: { slug: data.slug },
    });
    if (slugExists) throw new Error("SLUG_EXISTS");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.landingPage.update({
      where: { id },
      data,
    });

    if (adminId) {
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: "UPDATE_LANDING_PAGE",
          entity: "LandingPage",
        },
      });
    }

    return updated;
  });
}

export async function deleteLandingPage(id: string, adminId?: string) {
  const lpExists = await prisma.landingPage.findUnique({ where: { id } });
  if (!lpExists) throw new Error("NOT_FOUND");

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.landingPage.delete({ where: { id } });

    if (adminId) {
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: "DELETE_LANDING_PAGE",
          entity: "LandingPage",
        },
      });
    }

    return deleted;
  });
}