import { prisma } from "../../lib/prisma.js";

export class WidgetService {
  async listPublic(position: string) {
    return prisma.widget.findMany({
      where: {
        position,
        active: true,
      },

      orderBy: {
        order: "asc",
      },
    });
  }

  async create(data: any) {
    return prisma.widget.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.widget.update({
      where: {
        id,
      },

      data,
    });
  }

  async remove(id: string) {
    return prisma.widget.delete({
      where: {
        id,
      },
    });
  }
  async listAll() {
    return prisma.widget.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async delete(id: string) {
    return prisma.widget.delete({
      where: {
        id,
      },
    });
  }
}
