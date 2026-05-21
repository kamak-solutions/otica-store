import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.storefrontTheme.upsert({
    where: {
      key: "default",
    },
    update: {
      primaryColor: "#6F330B",
      secondaryColor: "#E75900",
      accentColor: "#B8914B",
      backgroundColor: "#F9F4EF",
      surfaceColor: "#FFFFFF",
      titleColor: "#2C2520",
      textColor: "#7F7169",
      borderColor: "#E7D8CC",
      buttonTextColor: "#FFFFFF",
    },
    create: {
      key: "default",
      primaryColor: "#6F330B",
      secondaryColor: "#E75900",
      accentColor: "#B8914B",
      backgroundColor: "#F9F4EF",
      surfaceColor: "#FFFFFF",
      titleColor: "#2C2520",
      textColor: "#7F7169",
      borderColor: "#E7D8CC",
      buttonTextColor: "#FFFFFF",
    },
  });

  console.log("Storefront theme seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
