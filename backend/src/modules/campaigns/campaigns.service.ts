import { prisma } from "../../lib/prisma.js";

class CampaignsService {
  async listPublic(location?: string) {
    return prisma.campaign.findMany({
      where: {
        active: true,

        deletedAt: null,

        ...(location && {
          location,
        }),
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async list() {
    return prisma.campaign.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: any) {
    return prisma.campaign.create({
      data,
    });
  }

  async delete(id: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    return prisma.campaign.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async update(id: string, data: any) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    return prisma.campaign.update({
      where: {
        id,
      },

      data,
    });
  }

  async toggle(id: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    return prisma.campaign.update({
      where: {
        id,
      },

      data: {
        active: !campaign.active,
      },
    });
  }
}

export const campaignsService = new CampaignsService();
