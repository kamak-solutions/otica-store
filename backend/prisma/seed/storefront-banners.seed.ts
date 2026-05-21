import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const banners = [
  {
    key: "home_banner",
    kicker: "Vitrine da semana",
    title: "Armações, solares e lentes com atendimento personalizado",
    description:
      "Escolha seu produto, envie sua receita se precisar e receba uma orientação mais segura para comprar melhor.",
    buttonLabel: "Ver produtos",
    buttonHref: "#modelos",
    active: true,
  },
  {
    key: "campaign_banner",
    kicker: "Campanha do mês",
    title: "Varilux em dobro",
    description:
      "Consulte condições especiais para lentes Varilux e monte seu orçamento com atendimento personalizado.",
    buttonLabel: "Quero orçamento",
    buttonHref: "#receita",
    active: true,
  },
  {
    key: "quote_banner",
    kicker: "Receita e lentes",
    title: "Tem receita? Envie para fazermos seu orçamento",
    description:
      "Ideal para lentes de grau, multifocais, antirreflexo, blue cut ou opções específicas para sua rotina.",
    buttonLabel: "Solicitar orçamento",
    buttonHref: "/orcamento",
    active: true,
  },
];

async function main() {
  for (const banner of banners) {
    await prisma.storefrontBanner.upsert({
      where: {
        key: banner.key,
      },
      update: banner,
      create: banner,
    });
  }

  console.log("Storefront banners seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
