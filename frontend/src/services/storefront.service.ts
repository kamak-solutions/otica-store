import { apiFetch } from "./api";

export type StorefrontHeroSlide = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryAction: string;
  secondaryAction: string;
  position: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ListHeroSlidesResponse = {
  data: StorefrontHeroSlide[];
};

export function listPublicHeroSlides() {
  return apiFetch<ListHeroSlidesResponse>("/storefront/hero-slides");
}
