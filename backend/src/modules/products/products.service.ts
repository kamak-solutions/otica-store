import { prisma } from "../../lib/prisma.js";

import type {
  CreateProductBody,
  CreateProductImageBody,
  UpdateProductBody,
} from "./products.schemas.js";

const productInclude = {
  category: true,

  frameDetails: {
    include: {
      collection: true,
      supplier: true,
    },
  },

  images: {
    orderBy: {
      position: "asc" as const,
    },
  },
};

export async function listProducts() {
  return prisma.product.findMany({
    where: {
      active: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: productInclude,
  });
}

export async function listAdminProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: productInclude,
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      active: true,
    },

    include: productInclude,
  });
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },

    include: productInclude,
  });
}

export async function createProduct(data: CreateProductBody) {
  return prisma.product.create({
    data,

    include: productInclude,
  });
}

export async function updateProduct(id: string, data: UpdateProductBody) {
  return prisma.product.update({
    where: {
      id,
    },

    data,

    include: productInclude,
  });
}

export async function deactivateProduct(id: string) {
  return prisma.product.update({
    where: {
      id,
    },

    data: {
      active: false,
    },

    include: productInclude,
  });
}

export async function addProductImage(
  productId: string,
  data: CreateProductImageBody,
) {
  return prisma.$transaction(async (tx) => {
    if (data.isMain) {
      await tx.productImage.updateMany({
        where: {
          productId,
          isMain: true,
        },

        data: {
          isMain: false,
        },
      });
    }

    await tx.productImage.create({
      data: {
        productId,
        url: data.url,
        publicId: data.publicId ?? null,
        alt: data.alt ?? null,
        position: data.position,
        isMain: data.isMain,
      },
    });

    return tx.product.findUniqueOrThrow({
      where: {
        id: productId,
      },

      include: productInclude,
    });
  });
}

export async function setProductImageAsMain(
  productId: string,
  imageId: string,
) {
  return prisma.$transaction(async (tx) => {
    const image = await tx.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      throw new Error("Imagem do produto não encontrada.");
    }

    await tx.productImage.updateMany({
      where: {
        productId,
        isMain: true,
      },

      data: {
        isMain: false,
      },
    });

    await tx.productImage.update({
      where: {
        id: imageId,
      },

      data: {
        isMain: true,
      },
    });

    return tx.product.findUniqueOrThrow({
      where: {
        id: productId,
      },

      include: productInclude,
    });
  });
}

export async function removeProductImage(productId: string, imageId: string) {
  return prisma.$transaction(async (tx) => {
    const image = await tx.productImage.findFirst({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!image) {
      throw new Error("Imagem do produto não encontrada.");
    }

    await tx.productImage.delete({
      where: {
        id: imageId,
      },
    });

    return tx.product.findUniqueOrThrow({
      where: {
        id: productId,
      },

      include: productInclude,
    });
  });
}
