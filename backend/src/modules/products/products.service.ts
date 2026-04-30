import { prisma } from "../../lib/prisma.js";
import type {
  CreateProductBody,
  CreateProductImageBody,
  UpdateProductBody,
} from "./products.schemas.js";

export async function listProducts() {
  return prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function listAdminProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function createProduct(data: CreateProductBody) {
  return prisma.product.create({
    data,
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function updateProduct(id: string, data: UpdateProductBody) {
  return prisma.product.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
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
    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
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
        publicId: data.publicId || null,
        alt: data.alt || null,
        position: data.position,
        isMain: data.isMain,
      },
    });

    return tx.product.findUniqueOrThrow({
      where: {
        id: productId,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  });
}