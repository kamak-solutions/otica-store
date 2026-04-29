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
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL e ADMIN_PASSWORD precisam estar no .env.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.update({
    where: {
      email: adminEmail,
    },
    data: {
      passwordHash,
      active: true,
    },
  });

  console.log("Senha do admin atualizada:", admin.email);
}

main()
  .catch((error) => {
    console.error("Erro ao atualizar senha do admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });