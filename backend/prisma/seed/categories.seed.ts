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

const categories = [
  {
    name: "Óculos de grau",
    slug: "oculos-de-grau",
    description: "Óculos de grau para diferentes estilos e necessidades.",
  },
  {
    name: "Óculos solar",
    slug: "oculos-solar",
    description: "Óculos solares para proteção e estilo.",
  },
  {
    name: "Armações",
    slug: "armacoes",
    description: "Armações para lentes de grau.",
  },
  {
    name: "Lentes",
    slug: "lentes",
    description: "Lentes oftálmicas e soluções relacionadas.",
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    description: "Acessórios para cuidado e proteção dos óculos.",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        active: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: true,
      },
    });
  }

  console.log("Categorias criadas/atualizadas com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao criar categorias:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });