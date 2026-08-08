import { useEffect, useState } from "react";

import { BlogPreview } from "../../components/public/home/BlogPreview";
import { CampaignBanner } from "../../components/public/home/CampaignBanner";
import { CategoryShortcuts } from "../../components/public/home/CategoryShortcuts";
import { HeroCarousel } from "../../components/public/home/HeroCarousel";
import { HomeBanner } from "../../components/public/home/HomeBanner";
import { LensBrands } from "../../components/public/home/LensBrands";
import { ProductPreviewSection } from "../../components/public/home/ProductPreviewSection";
import { QuoteBanner } from "../../components/public/home/QuoteBanner";
import { Testimonials } from "../../components/public/home/Testimonials";

import { Seo } from "../../components/seo/Seo";

import { getProducts } from "../../services/products.service";

import {
  listPublicBanners,
  listPublicHeroSlides,
  type StorefrontBanner,
  type StorefrontHeroSlide,
} from "../../services/storefront.service";

import { StorefrontThemeProvider } from "../../components/public/StorefrontThemeProvider";

import type { Product } from "../../types/product";
import { PromoModal } from "../../components/public/PromoModal";
import type { Campaign } from "../../types/campaign";
import { listPublicCampaigns } from "../../services/campaigns.service";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [heroSlides, setHeroSlides] = useState<StorefrontHeroSlide[]>([]);

  const [banners, setBanners] = useState<StorefrontBanner[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getProducts();

        setProducts(response.data);
      } catch (error) {
        setProductsError(
          error instanceof Error ? error.message : "Erro ao carregar produtos.",
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await listPublicBanners();

        setBanners(response.data);
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      }
    }

    loadBanners();
  }, []);

  useEffect(() => {
    async function loadHeroSlides() {
      try {
        const response = await listPublicHeroSlides();

        setHeroSlides(response.data);
      } catch (error) {
        console.error("Erro ao carregar slides:", error);
      }
    }

    loadHeroSlides();
  }, []);
  async function loadCampaigns() {
    try {
      const data = await listPublicCampaigns("home");

      setCampaigns(data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        await loadCampaigns();
      } catch (error) {
        console.error("Erro ao carregar campanhas:", error);
      }
    }

    void fetchData();
  }, []);

  const homeBanner = banners.find((banner) => banner.key === "home_banner");

  const campaignBanner = banners.find(
    (banner) => banner.key === "campaign_banner",
  );

  const quoteBanner = banners.find((banner) => banner.key === "quote_banner");
  console.log(campaigns);
  const activeCampaign = campaigns[0] ?? null;
  return (
    <main className="home-page">
      <StorefrontThemeProvider />
      <PromoModal campaign={activeCampaign} />

      <Seo
        title="Ótica ShowRoom | Óculos, lentes e orçamento online"
        description="Ótica ShowRoom: óculos de grau, armações, lentes e orçamento online com atendimento personalizado."
      />

      <HeroCarousel slides={heroSlides} />

      <CategoryShortcuts />

      <HomeBanner banner={homeBanner} />

      {productsError && (
        <section className="site-container">
          <p className="section-empty-message">{productsError}</p>
        </section>
      )}

      {isLoadingProducts ? (
        <section className="site-container home-section">
          <p className="section-empty-message">Carregando produtos...</p>
        </section>
      ) : (
        <ProductPreviewSection
          kicker="Vitrine"
          title="Destaques da loja"
          description="Explore alguns modelos selecionados. Veja o catálogo completo para acessar filtros e todos os produtos."
          products={products}
          emptyMessage="Nenhum produto encontrado."
        />
      )}

      <CampaignBanner banner={campaignBanner} />
      <BlogPreview />
      <QuoteBanner banner={quoteBanner} />

      <LensBrands />

      <Testimonials />
    </main>
  );
}
