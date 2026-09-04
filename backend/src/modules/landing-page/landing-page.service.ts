import { prisma } from "../../lib/prisma.js";
import { z } from "zod";
import {
  createLandingPageSchema,
  updateLandingPageSchema,
} from "./landing-page.schema.js";
import { deleteLandingPageImageFile } from "../uploads/uploads.service.js";
import { AppError } from "../../errors/app-error.js";

export async function getPublicLandingPageBySlug(slug: string) {
  return prisma.landingPage.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      sections: {
        where: {
          active: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}
export async function getLandingPageById(id: string) {
  return prisma.landingPage.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function listAllLandingPages() {
  return prisma.landingPage.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          sections: true,
        },
      },
    },
  });
}

export async function createLandingPage(
  data: z.infer<typeof createLandingPageSchema>,
  adminId?: string,
) {
  const slugExists = await prisma.landingPage.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (slugExists) {
    throw new Error("SLUG_EXISTS");
  }

  const { sections, ...landingPageData } = data;

  return prisma.$transaction(async (tx) => {
    const lp = await tx.landingPage.create({
      data: {
        ...landingPageData,

        ...(sections?.length
          ? {
              sections: {
                create: sections.map((section, index) => ({
                  type: section.type || "features",
                  title: section.title,
                  subtitle: section.subtitle,
                  content: section.content,
                  imageUrl: section.imageUrl,
                  buttonText: section.buttonText,
                  buttonLink: section.buttonLink,
                  bgColor: section.bgColor,
                  textColor: section.textColor,
                  order: index,
                })),
              },
            }
          : {}),
      },
      include: {
        sections: true,
      },
    });

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
  const lpExists = await prisma.landingPage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      heroBannerPublicId: true,
    },
  });

  if (!lpExists) {
    throw new AppError("Landing page não encontrada.", 404, "Not found");
  }

  if (data.slug && data.slug !== lpExists.slug) {
    const slugExists = await prisma.landingPage.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (slugExists) {
      throw new Error("SLUG_EXISTS");
    }
  }

  const { sections, ...landingPageData } = data;

  const updated = await prisma.$transaction(async (tx) => {
    const updated = await tx.landingPage.update({
      where: {
        id,
      },
      data: {
        ...landingPageData,

        ...(sections
          ? {
              sections: {
                deleteMany: {},
                create: sections.map((section, index) => ({
                  type: section.type || "features",
                  title: section.title,
                  subtitle: section.subtitle,
                  content: section.content,
                  imageUrl: section.imageUrl,
                  buttonText: section.buttonText,
                  buttonLink: section.buttonLink,
                  bgColor: section.bgColor,
                  textColor: section.textColor,
                  order: index,
                })),
              },
            }
          : {}),
      },
      include: {
        sections: true,
      },
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

  if (
    data.heroBannerPublicId !== undefined &&
    data.heroBannerPublicId !== lpExists.heroBannerPublicId &&
    lpExists.heroBannerPublicId
  ) {
    try {
      await deleteLandingPageImageFile(lpExists.heroBannerPublicId);
    } catch (error) {
      console.error(
        "Falha ao remover imagem anterior da Landing Page do Cloudinary após atualização:",
        error,
      );
    }
  }

  return updated;
}

export async function deleteLandingPage(id: string, adminId?: string) {
  const lpExists = await prisma.landingPage.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      heroBannerPublicId: true,
    },
  });

  if (!lpExists) {
    throw new AppError("Landing page não encontrada.", 404, "Not found");
  }

  const deleted = await prisma.$transaction(async (tx) => {
    const result = await tx.landingPage.delete({
      where: {
        id,
      },
    });

    if (adminId) {
      await tx.adminAuditLog.create({
        data: {
          adminId,
          action: "DELETE_LANDING_PAGE",
          entity: "LandingPage",
        },
      });
    }

    return result;
  });

  if (lpExists.heroBannerPublicId) {
    try {
      await deleteLandingPageImageFile(lpExists.heroBannerPublicId);
    } catch (error) {
      console.error(
        "Falha ao remover imagem da Landing Page do Cloudinary após exclusão:",
        error,
      );
    }
  }

  return deleted;
}
