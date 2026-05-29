import type { Campaign } from "../types/campaign";

export const campaigns: Campaign[] = [
  {
    id: "welcome-1",

    title: "🔥 Semana Varilux",

    description:
      "Ganhe até 30% OFF em lentes selecionadas.",

    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200",

    buttonText: "Ver ofertas",

    buttonLink: "/produtos",

    location: "home",

    active: true,

    showDelay: 3000,

    showOnlyOnce: true,
  },
];