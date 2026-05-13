import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateAdminUserBody,
  UpdateAdminUserRoleBody,
  UpdateAdminUserActiveBody,
} from "./admin-users.schemas.js";

export async function listAdminUsers() {
  return prisma.adminUser.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createAdminUser(data: CreateAdminUserBody) {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingAdmin) {
    throw new AppError("Já existe um usuário admin com este e-mail.", 409, "Conflict");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.adminUser.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role,
      active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateAdminUserRole(
  id: string,
  data: UpdateAdminUserRoleBody,
) {
  return prisma.adminUser.update({
    where: {
      id,
    },
    data: {
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateAdminUserActive(
  id: string,
  data: UpdateAdminUserActiveBody,
  currentAdminId?: string,
) {
  if (id === currentAdminId && data.active === false) {
    throw new AppError(
      "Você não pode desativar o próprio usuário.",
      400,
      "Bad Request",
    );
  }

  return prisma.adminUser.update({
    where: {
      id,
    },
    data: {
      active: data.active,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
