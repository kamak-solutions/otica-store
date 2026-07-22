import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  CreateProductCollectionBody,
  UpdateProductCollectionBody,
} from "./product-collections.schemas.js";

export async function listProductCollections() {
  return prisma.productCollection.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findProductCollectionById(id: string) {
  return prisma.productCollection.findUnique({
    where: {
      id,
    },
  });
}

export async function createProductCollection(
  data: CreateProductCollectionBody,
) {
  try {
    return await prisma.productCollection.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description ?? null,
        active: data.active,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe uma coleção com este código.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}

export async function updateProductCollection(
  id: string,
  data: UpdateProductCollectionBody,
) {
  const collection = await findProductCollectionById(id);

  if (!collection) {
    throw new AppError(
      "Coleção não encontrada.",
      404,
      "Not found",
    );
  }

  try {
    return await prisma.productCollection.update({
      where: {
        id,
      },
      data: {
        ...(data.code !== undefined && {
          code: data.code,
        }),

        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.description !== undefined && {
          description: data.description ?? null,
        }),

        ...(data.active !== undefined && {
          active: data.active,
        }),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe uma coleção com este código.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}

export async function deactivateProductCollection(id: string) {
  const collection = await findProductCollectionById(id);

  if (!collection) {
    throw new AppError(
      "Coleção não encontrada.",
      404,
      "Not found",
    );
  }

  return prisma.productCollection.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}