import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminName = process.env.ADMIN_NAME || "Administrador";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL e ADMIN_PASSWORD precisam estar configurados no .env.",
    );
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log("Admin já existe:", adminEmail);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "owner",
      active: true,
    },
  });

  console.log("Admin criado com sucesso:", adminEmail);
}

main()
  .catch((error) => {
    console.error("Erro ao criar admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });