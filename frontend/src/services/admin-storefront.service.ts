import { apiFetch } from "./api";
import type {
  StorefrontBanner,
  StorefrontHeroSlide,
  StorefrontTheme,
} from "./storefront.service";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type UpdateStorefrontHeroSlidePayload = {
  kicker?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  primaryAction?: string;
  primaryActionHref?: string;
  secondaryAction?: string;
  secondaryActionHref?: string;
  position?: number;
  active?: boolean;
};

export type UpdateStorefrontThemePayload = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  titleColor?: string;
  textColor?: string;
  borderColor?: string;
  buttonTextColor?: string;
  bannerContentOpacity?: number;
};

type GetAdminThemeResponse = {
  data: StorefrontTheme;
};

type UpdateThemeResponse = {
  data: StorefrontTheme;
  message: string;
};

type ListAdminHeroSlidesResponse = {
  data: StorefrontHeroSlide[];
};

type UpdateHeroSlideResponse = {
  data: StorefrontHeroSlide;
  message: string;
};

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function listAdminHeroSlides() {
  return apiFetch<ListAdminHeroSlidesResponse>(
    "/admin/storefront/hero-slides",
    {
      headers: getAdminAuthHeaders(),
    },
  );
}

export function createAdminHeroSlide(
  payload: UpdateStorefrontHeroSlidePayload,
) {
  return apiFetch<UpdateHeroSlideResponse>("/admin/storefront/hero-slides", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function updateAdminHeroSlide(
  id: string,
  payload: UpdateStorefrontHeroSlidePayload,
) {
  return apiFetch<UpdateHeroSlideResponse>(
    `/admin/storefront/hero-slides/${id}`,
    {
      method: "PATCH",
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(payload),
    },
  );
}
export function deleteAdminHeroSlide(id: string) {
  return apiFetch<UpdateHeroSlideResponse>(
    `/admin/storefront/hero-slides/${id}`,
    {
      method: "DELETE",
      headers: getAdminAuthHeaders(),
    },
  );
}
export type UpdateStorefrontBannerPayload = {
  kicker?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  imageUrl?: string | null;
  imagePosition?: string;
  active?: boolean;
};

type ListAdminBannersResponse = {
  data: StorefrontBanner[];
};

type UpdateBannerResponse = {
  data: StorefrontBanner;
  message: string;
};
export function listAdminBanners() {
  return apiFetch<ListAdminBannersResponse>("/admin/storefront/banners", {
    headers: getAdminAuthHeaders(),
  });
}

export function updateAdminBanner(
  id: string,
  payload: UpdateStorefrontBannerPayload,
) {
  return apiFetch<UpdateBannerResponse>(`/admin/storefront/banners/${id}`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}
export function getAdminTheme() {
  return apiFetch<GetAdminThemeResponse>("/admin/storefront/theme", {
    headers: getAdminAuthHeaders(),
  });
}

export function updateAdminTheme(payload: UpdateStorefrontThemePayload) {
  return apiFetch<UpdateThemeResponse>("/admin/storefront/theme", {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(payload),
  });
}
