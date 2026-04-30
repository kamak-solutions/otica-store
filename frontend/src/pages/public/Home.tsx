import { useEffect, useMemo, useState } from "react";
import { BlogPreview } from "../../components/public/home/BlogPreview";
import { CampaignBanner } from "../../components/public/home/CampaignBanner";
import { CategoryShortcuts } from "../../components/public/home/CategoryShortcuts";
import { HeroCarousel } from "../../components/public/home/HeroCarousel";
import { HomeBanner } from "../../components/public/home/HomeBanner";
import { LensBrands } from "../../components/public/home/LensBrands";
import { ProductPreviewSection } from "../../components/public/home/ProductPreviewSection";
import { QuoteBanner } from "../../components/public/home/QuoteBanner";
import { Testimonials } from "../../components/public/home/Testimonials";
import { getProducts } from "../../services/products.service";
import { audienceFilters, categoryFilters } from "../../data/home-content";
import type { Product } from "../../types/product";

function normalizeAudienceFilter(filter: string) {
  if (filter === "Todos") {
    return "todos";
  }

  return filter
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeCategoryFilter(filter: string) {
  const map: Record<string, string> = {
    Todos: "todos",
    "Óculos Solar": "oculos-solar",
    "Óculos de Grau": "oculos-de-grau",
    Armações: "armacoes",
    Lentes: "lentes",
    Acessórios: "acessorios",
  };

  return map[filter] ?? "todos";
}

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeAudienceFilter, setActiveAudienceFilter] = useState("Todos");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("Todos");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

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

  const audienceProducts = useMemo(() => {
    const selectedAudience = normalizeAudienceFilter(activeAudienceFilter);

    if (selectedAudience === "todos") {
      return products.slice(0, 8);
    }

    return products
      .filter((product) => product.audience === selectedAudience)
      .slice(0, 8);
  }, [products, activeAudienceFilter]);

  const categoryProducts = useMemo(() => {
    const selectedCategory = normalizeCategoryFilter(activeCategoryFilter);

    if (selectedCategory === "todos") {
      return products.slice(0, 8);
    }

    return products
      .filter((product) => product.category?.slug === selectedCategory)
      .slice(0, 8);
  }, [products, activeCategoryFilter]);

  return (
    <main className="home-page">
      <HeroCarousel />

      <CategoryShortcuts />

      <HomeBanner />
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
        <>{/* AQUI ficam seus ProductPreviewSection */}</>
      )}

      <ProductPreviewSection
        id="modelos"
        kicker="Escolha por estilo"
        title="Encontre seu modelo ideal"
        description="Escolha por público e veja produtos selecionados para você."
        filters={audienceFilters}
        activeFilter={activeAudienceFilter}
        onFilterChange={setActiveAudienceFilter}
        products={audienceProducts}
        emptyMessage="Nenhum produto encontrado para esse público."
      />

      <CampaignBanner />

      <ProductPreviewSection
        id="categorias"
        kicker="Compre por categoria"
        title="Explore nossas categorias"
        description="Escolha entre óculos solares, grau, armações, lentes e acessórios."
        filters={categoryFilters}
        activeFilter={activeCategoryFilter}
        onFilterChange={setActiveCategoryFilter}
        products={categoryProducts}
        emptyMessage="Nenhum produto encontrado para essa categoria."
      />

      <QuoteBanner />

      <LensBrands />

      <BlogPreview />

      <Testimonials />
    </main>
  );
}
