import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  CreateSupplierBody,
  UpdateSupplierBody,
} from "./suppliers.schemas.js";

export async function listSuppliers() {
  return prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: {
      id,
    },
  });
}

export async function createSupplier(data: CreateSupplierBody) {
  try {
    return await prisma.supplier.create({
      data: {
        code: data.code,
        name: data.name,
        contactName: data.contactName ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        active: data.active,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Já existe um fornecedor com este código.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}

export async function updateSupplier(
  id: string,
  data: UpdateSupplierBody,
) {
  const supplier = await findSupplierById(id);

  if (!supplier) {
    throw new AppError(
      "Fornecedor não encontrado.",
      404,
      "Not found",
    );
  }

  try {
    return await prisma.supplier.update({
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

        ...(data.contactName !== undefined && {
          contactName: data.contactName ?? null,
        }),

        ...(data.phone !== undefined && {
          phone: data.phone ?? null,
        }),

        ...(data.email !== undefined && {
          email: data.email ?? null,
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
        "Já existe um fornecedor com este código.",
        409,
        "Conflict",
      );
    }

    throw error;
  }
}

export async function deactivateSupplier(id: string) {
  const supplier = await findSupplierById(id);

  if (!supplier) {
    throw new AppError(
      "Fornecedor não encontrado.",
      404,
      "Not found",
    );
  }

  return prisma.supplier.update({
    where: {
      id,
    },
    data: {
      active: false,
    },
  });
}