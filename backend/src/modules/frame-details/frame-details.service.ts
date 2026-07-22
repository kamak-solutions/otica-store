import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  CreateFrameDetailsBody,
  UpdateFrameDetailsBody,
} from "./frame-details.schemas.js";

export async function findFrameDetailsByProductId(productId: string) {
  return prisma.frameDetails.findUnique({
    where: {
      productId,
    },
    include: {
      supplier: true,
      collection: true,
    },
  });
}

export async function createFrameDetails(
  productId: string,
  data: CreateFrameDetailsBody,
) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      productType: true,
    },
  });

  if (!product) {
    throw new AppError(
      "Produto não encontrado.",
      404,
      "Not found",
    );
  }

  const existingFrameDetails =
    await findFrameDetailsByProductId(productId);

  if (existingFrameDetails) {
    throw new AppError(
      "Este produto já possui detalhes de armação.",
      409,
      "Conflict",
    );
  }

  const supplier = await prisma.supplier.findUnique({
    where: {
      id: data.supplierId,
    },
    select: {
      id: true,
      active: true,
    },
  });

  if (!supplier) {
    throw new AppError(
      "Fornecedor não encontrado.",
      404,
      "Not found",
    );
  }

  if (!supplier.active) {
    throw new AppError(
      "Não é possível vincular um fornecedor inativo.",
      409,
      "Conflict",
    );
  }

  if (data.collectionId) {
    const collection =
      await prisma.productCollection.findUnique({
        where: {
          id: data.collectionId,
        },
        select: {
          id: true,
          active: true,
        },
      });

    if (!collection) {
      throw new AppError(
        "Coleção não encontrada.",
        404,
        "Not found",
      );
    }

    if (!collection.active) {
      throw new AppError(
        "Não é possível vincular uma coleção inativa.",
        409,
        "Conflict",
      );
    }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const frameDetails = await tx.frameDetails.create({
        data: {
          productId,
          supplierId: data.supplierId,
          collectionId: data.collectionId ?? null,

          supplierCode: data.supplierCode ?? null,
          internalCode: data.internalCode,
          modelCode: data.modelCode,
          publicBrand: data.publicBrand,

          audience: data.audience,
          material: data.material,
          shape: data.shape,

          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor ?? null,
          finish: data.finish ?? null,

          lensWidth: data.lensWidth ?? null,
          bridgeWidth: data.bridgeWidth ?? null,
          templeLength: data.templeLength ?? null,
          sizeLabel: data.sizeLabel ?? null,
        },
        include: {
          supplier: true,
          collection: true,
        },
      });

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          productType: "frame",
          audience: data.audience,
          frameShape: data.shape,
          color: data.primaryColor,
          brand: data.publicBrand,
        },
      });

      return frameDetails;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe uma armação com este código interno.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}

export async function updateFrameDetails(
  productId: string,
  data: UpdateFrameDetailsBody,
) {
  const current = await findFrameDetailsByProductId(productId);

  if (!current) {
    throw new AppError(
      "Detalhes da armação não encontrados.",
      404,
      "Not found",
    );
  }

  if (data.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: data.supplierId,
      },
      select: {
        active: true,
      },
    });

    if (!supplier) {
      throw new AppError(
        "Fornecedor não encontrado.",
        404,
        "Not found",
      );
    }

    if (!supplier.active) {
      throw new AppError(
        "Não é possível vincular um fornecedor inativo.",
        409,
        "Conflict",
      );
    }
  }

  if (data.collectionId) {
    const collection =
      await prisma.productCollection.findUnique({
        where: {
          id: data.collectionId,
        },
        select: {
          active: true,
        },
      });

    if (!collection) {
      throw new AppError(
        "Coleção não encontrada.",
        404,
        "Not found",
      );
    }

    if (!collection.active) {
      throw new AppError(
        "Não é possível vincular uma coleção inativa.",
        409,
        "Conflict",
      );
    }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const frameDetails = await tx.frameDetails.update({
        where: {
          productId,
        },
        data: {
          ...(data.supplierId !== undefined && {
            supplierId: data.supplierId,
          }),

          ...(data.collectionId !== undefined && {
            collectionId: data.collectionId,
          }),

          ...(data.supplierCode !== undefined && {
            supplierCode: data.supplierCode ?? null,
          }),

          ...(data.internalCode !== undefined && {
            internalCode: data.internalCode,
          }),

          ...(data.modelCode !== undefined && {
            modelCode: data.modelCode,
          }),

          ...(data.publicBrand !== undefined && {
            publicBrand: data.publicBrand,
          }),

          ...(data.audience !== undefined && {
            audience: data.audience,
          }),

          ...(data.material !== undefined && {
            material: data.material,
          }),

          ...(data.shape !== undefined && {
            shape: data.shape,
          }),

          ...(data.primaryColor !== undefined && {
            primaryColor: data.primaryColor,
          }),

          ...(data.secondaryColor !== undefined && {
            secondaryColor: data.secondaryColor ?? null,
          }),

          ...(data.finish !== undefined && {
            finish: data.finish ?? null,
          }),

          ...(data.lensWidth !== undefined && {
            lensWidth: data.lensWidth,
          }),

          ...(data.bridgeWidth !== undefined && {
            bridgeWidth: data.bridgeWidth,
          }),

          ...(data.templeLength !== undefined && {
            templeLength: data.templeLength,
          }),

          ...(data.sizeLabel !== undefined && {
            sizeLabel: data.sizeLabel ?? null,
          }),
        },
        include: {
          supplier: true,
          collection: true,
        },
      });

      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          ...(data.audience !== undefined && {
            audience: data.audience,
          }),

          ...(data.shape !== undefined && {
            frameShape: data.shape,
          }),

          ...(data.primaryColor !== undefined && {
            color: data.primaryColor,
          }),

          ...(data.publicBrand !== undefined && {
            brand: data.publicBrand,
          }),
        },
      });

      return frameDetails;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe uma armação com este código interno.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}