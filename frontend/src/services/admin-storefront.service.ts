import { apiFetch } from "./api";
import type { StorefrontHeroSlide } from "./storefront.service";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

export type UpdateStorefrontHeroSlidePayload = {
  kicker?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  primaryAction?: string;
  secondaryAction?: string;
  position?: number;
  active?: boolean;
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
