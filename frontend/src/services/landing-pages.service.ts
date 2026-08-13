import { apiFetch } from "./api";

export interface LandingPageSection {
  id?: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  textColor?: string;
  order: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  active: boolean;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBannerUrl?: string;
  heroBannerPublicId?: string;
  heroBadge?: string;
  ctaText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  createdAt: string;
  updatedAt: string;
  sections?: LandingPageSection[];
}

export interface CreateLandingPageInput {
  title: string;
  slug: string;
  active?: boolean;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;

  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBannerUrl?: string;
  heroBannerPublicId?: string;

  ctaText?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;

  sections?: Array<{
    title: string;
    content: string;
  }>;
}

export type UpdateLandingPageInput = Partial<CreateLandingPageInput>;

export const landingPagesService = {
  getBySlug: (slug: string): Promise<LandingPage> => {
    return apiFetch<LandingPage>(`/${slug}`);
  },

  getById: async (id: string): Promise<LandingPage> => {
    const res = await apiFetch<{ data: LandingPage }>(
      `/admin/landing-pages/${id}`,
    );
    return res.data;
  },

  list: async (): Promise<LandingPage[]> => {
    const res = await apiFetch<{ data: LandingPage[] }>("/admin/landing-pages");

    return res.data;
  },

  create: async (data: CreateLandingPageInput): Promise<LandingPage> => {
    const res = await apiFetch<{ data: LandingPage }>("/admin/landing-pages", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (
    id: string,
    data: UpdateLandingPageInput,
  ): Promise<LandingPage> => {
    const res = await apiFetch<{ data: LandingPage }>(
      `/admin/landing-pages/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return res.data;
  },

  delete: (id: string): Promise<void> => {
    return apiFetch<void>(`/admin/landing-pages/${id}`, {
      method: "DELETE",
    });
  },
};
