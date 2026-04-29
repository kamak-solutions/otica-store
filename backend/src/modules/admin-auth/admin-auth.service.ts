import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { signAdminToken } from "../../lib/admin-jwt.js";
import type { AdminLoginBody } from "./admin-auth.schemas.js";

export async function loginAdmin(data: AdminLoginBody) {
  const admin = await prisma.adminUser.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!admin || !admin.active) {
    throw new AppError("E-mail ou senha inválidos.", 401, "Unauthorized");
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    admin.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError("E-mail ou senha inválidos.", 401, "Unauthorized");
  }

  const adminResponse = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };

  const token = signAdminToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    admin: adminResponse,
    token,
  };
}