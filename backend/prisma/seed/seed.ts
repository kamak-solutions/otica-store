import "dotenv/config";
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
  await prisma.product.createMany({
    data: [
      {
        name: "Óculos Solar Premium",
        slug: "oculos-solar-premium",
        description: "Óculos solar elegante para uso diário.",
        price: 199.9,
        stock: 10,
        active: true,
      },
      {
        name: "Armação Feminina Clássica",
        slug: "armacao-feminina-classica",
        description: "Armação leve e confortável.",
        price: 149.9,
        stock: 5,
        active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed executado com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });