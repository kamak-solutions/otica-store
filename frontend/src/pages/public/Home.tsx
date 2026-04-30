import { BlogPreview } from "../../components/public/home/BlogPreview";
import { CampaignBanner } from "../../components/public/home/CampaignBanner";
import { CategoryShortcuts } from "../../components/public/home/CategoryShortcuts";
import { HeroCarousel } from "../../components/public/home/HeroCarousel";
import { HomeBanner } from "../../components/public/home/HomeBanner";
import { LensBrands } from "../../components/public/home/LensBrands";
import { ProductPreviewSection } from "../../components/public/home/ProductPreviewSection";
import { QuoteBanner } from "../../components/public/home/QuoteBanner";
import { Testimonials } from "../../components/public/home/Testimonials";
import { audienceFilters, categoryFilters } from "../../data/home-content";

export function Home() {
  return (
    <main className="home-page">
      <HeroCarousel />

      <CategoryShortcuts />

      <HomeBanner />

      <CampaignBanner />

      <ProductPreviewSection
        id="modelos"
        kicker="Escolha por estilo"
        title="Encontre seu modelo ideal"
        description="Depois vamos ligar essa seção aos produtos reais do backend."
        filters={audienceFilters}
      />

      <ProductPreviewSection
        id="categorias"
        kicker="Compre por categoria"
        title="Explore nossas categorias"
        filters={categoryFilters}
      />

      <QuoteBanner />

      <LensBrands />

      <BlogPreview />

      <Testimonials />
    </main>
  );
}
