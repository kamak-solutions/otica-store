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
export type StorefrontBanner = {
  id: string;
  key: "home_banner" | "campaign_banner" | "quote_banner" | string;
  kicker: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string | null;
  imagePosition: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
export type StorefrontTheme = {
  id: string;
  key: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  titleColor: string;
  textColor: string;
  borderColor: string;
  buttonTextColor: string;
  bannerContentOpacity: number;
  createdAt: string;
  updatedAt: string;
};
type ListHeroSlidesResponse = {
  data: StorefrontHeroSlide[];
};

type ListBannersResponse = {
  data: StorefrontBanner[];
};
type GetThemeResponse = {
  data: StorefrontTheme;
};
export function listPublicHeroSlides() {
  return apiFetch<ListHeroSlidesResponse>("/storefront/hero-slides");
}
export function listPublicBanners() {
  return apiFetch<ListBannersResponse>("/storefront/banners");
}
export function getPublicTheme() {
  return apiFetch<GetThemeResponse>("/storefront/theme");
}
