export type Campaign = {
  id: string;

  title: string;
  description?: string;

  imageUrl?: string;

  buttonText?: string;
  buttonLink?: string;

  location: "home" | "products" | "global";

  active: boolean;

  showDelay: number;

  showOnlyOnce: boolean;

  startDate?: string;
  endDate?: string;
  deletedAt?: string | null;
};