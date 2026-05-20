import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const heroSlides = [
  {
    kicker: "Nova coleção",
    title: "Armações modernas para renovar seu visual",
    description:
      "Escolha modelos confortáveis, elegantes e selecionados para combinar com seu estilo.",
    imageUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=2200&q=90&sat=20",
    primaryAction: "Ver armações",
    secondaryAction: "Enviar receita",
    position: 1,
    active: true,
  },
  {
    kicker: "Óculos solar",
    title: "Proteção e estilo para o seu dia a dia",
    description:
      "Modelos solares para rotina, lazer e combinações com personalidade.",
    imageUrl:
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=2200&q=90&sat=25",
    primaryAction: "Ver solares",
    secondaryAction: "Ver catálogo",
    position: 2,
    active: true,
  },
  {
    kicker: "Lentes de grau",
    title: "Envie sua receita e solicite um orçamento",
    description:
      "Receba orientação para lentes, armações e soluções visuais para sua rotina.",
    imageUrl:
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=2200&q=90&sat=20",
    primaryAction: "Solicitar orçamento",
    secondaryAction: "Conhecer lentes",
    position: 3,
    active: true,
  },
];

async function main() {
  for (const slide of heroSlides) {
    await prisma.storefrontHeroSlide.upsert({
      where: {
        id: `seed-hero-slide-${slide.position}`,
      },
      update: slide,
      create: {
        id: `seed-hero-slide-${slide.position}`,
        ...slide,
      },
    });
  }

  console.log("Storefront hero slides seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
