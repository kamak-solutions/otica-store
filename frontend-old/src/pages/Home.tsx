import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/products/ProductCard";
import { getCategories } from "../services/categories.service";
import { getProducts } from "../services/products.service";
import type { Category } from "../types/category";
import type { Product } from "../types/product";

type AudienceFilter =
  | "todos"
  | "feminino"
  | "masculino"
  | "infantil"
  | "unissex";

type HeroSlide = {
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryAction: string;
  secondaryAction: string;
};

const heroSlides: HeroSlide[] = [
  {
    kicker: "Nova coleção",
    title: "Armações modernas para renovar seu visual",
    description:
      "Escolha modelos confortáveis, elegantes e selecionados para combinar com seu estilo.",
    imageUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1600&q=80",
    primaryAction: "Ver armações",
    secondaryAction: "Enviar receita",
  },
  {
    kicker: "Óculos solar",
    title: "Proteção e estilo para o seu dia a dia",
    description:
      "Modelos solares para rotina, lazer e combinações com personalidade.",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80",
    primaryAction: "Ver solares",
    secondaryAction: "Ver catálogo",
  },
  {
    kicker: "Lentes de grau",
    title: "Envie sua receita e solicite um orçamento",
    description:
      "Receba orientação para lentes, armações e soluções visuais para sua rotina.",
    imageUrl:
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1600&q=80",
    primaryAction: "Solicitar orçamento",
    secondaryAction: "Conhecer lentes",
  },
];

const audienceFilters: {
  label: string;
  value: AudienceFilter;
}[] = [
  { label: "Todos", value: "todos" },
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Infantil", value: "infantil" },
  { label: "Unissex", value: "unissex" },
];

const preferredCategoryOrder = [
  "oculos-solar",
  "oculos-de-grau",
  "armacoes",
  "lentes",
  "acessorios",
];

function getProductsByAudience(
  products: Product[],
  audience: AudienceFilter,
) {
  if (audience === "todos") {
    return products.slice(0, 8);
  }

  return products.filter((product) => product.audience === audience).slice(0, 8);
}

function getProductsByCategory(products: Product[], categorySlug: string) {
  if (categorySlug === "todos") {
    return products.slice(0, 8);
  }

  return products
    .filter((product) => product.category?.slug === categorySlug)
    .slice(0, 8);
}

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedAudience, setSelectedAudience] =
    useState<AudienceFilter>("todos");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar produtos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) =>
        currentIndex === heroSlides.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = heroSlides[activeSlideIndex];

  const orderedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const indexA = preferredCategoryOrder.indexOf(a.slug);
      const indexB = preferredCategoryOrder.indexOf(b.slug);

      if (indexA === -1 && indexB === -1) {
        return a.name.localeCompare(b.name);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    });
  }, [categories]);

  const audienceProducts = useMemo(() => {
    return getProductsByAudience(products, selectedAudience);
  }, [products, selectedAudience]);

  const categoryProducts = useMemo(() => {
    return getProductsByCategory(products, selectedCategory);
  }, [products, selectedCategory]);

  if (isLoading) {
    return <p className="state-message">Carregando produtos...</p>;
  }

  if (error) {
    return <p className="state-message error-message">{error}</p>;
  }

  return (
    <div className="storefront-page">
      <section className="storefront-marquee">
        <span>🚚 Frete grátis em ofertas selecionadas</span>
        <span>•</span>
        <span>Envie sua receita para orçamento</span>
        <span>•</span>
        <span>Atendimento personalizado</span>
      </section>

      <section className="storefront-hero">
        <img
          className="storefront-hero-image"
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
        />

        <div className="storefront-hero-overlay" />

        <div className="storefront-hero-content">
          <span>{activeSlide.kicker}</span>

          <h1>{activeSlide.title}</h1>

          <p>{activeSlide.description}</p>

          <div className="storefront-hero-actions">
            <a className="primary-button storefront-button" href="#por-publico">
              {activeSlide.primaryAction}
            </a>

            <a className="secondary-button storefront-button" href="#receita">
              {activeSlide.secondaryAction}
            </a>
          </div>
        </div>

        <div className="storefront-hero-dots">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              className={index === activeSlideIndex ? "active" : ""}
              type="button"
              aria-label={`Ir para banner ${index + 1}`}
              onClick={() => setActiveSlideIndex(index)}
            />
          ))}
        </div>
      </section>

      <section className="storefront-category-shortcuts">
        {orderedCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              setSelectedCategory(category.slug);
              document
                .getElementById("por-categoria")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{category.name.slice(0, 2)}</span>
            <strong>{category.name}</strong>
          </button>
        ))}
      </section>

      <section className="storefront-banner">
        <div>
          <span>Vitrine da semana</span>
          <h2>Armações, solares e lentes com atendimento personalizado</h2>
          <p>
            Escolha seu produto, envie sua receita se precisar e receba uma
            orientação mais segura para comprar melhor.
          </p>
        </div>

        <a className="primary-button storefront-button" href="#por-publico">
          Ver produtos
        </a>
      </section>

      <section className="storefront-section" id="por-publico">
        <div className="storefront-heading">
          <span>Escolha por estilo</span>
          <h2>Encontre seu modelo ideal</h2>
          <p>Filtre por público e veja produtos selecionados para você.</p>
        </div>

        <div className="storefront-pills">
          {audienceFilters.map((filter) => (
            <button
              key={filter.value}
              className={
                selectedAudience === filter.value
                  ? "storefront-pill active"
                  : "storefront-pill"
              }
              type="button"
              onClick={() => setSelectedAudience(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {audienceProducts.length === 0 ? (
          <p className="state-message">
            Nenhum produto encontrado para esse público.
          </p>
        ) : (
          <div className="storefront-products-grid">
            {audienceProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="storefront-section" id="por-categoria">
        <div className="storefront-heading">
          <span>Compre por categoria</span>
          <h2>Explore nossas categorias</h2>
          <p>Escolha entre óculos solares, grau, armações, lentes e acessórios.</p>
        </div>

        <div className="storefront-pills">
          <button
            className={
              selectedCategory === "todos"
                ? "storefront-pill active"
                : "storefront-pill"
            }
            type="button"
            onClick={() => setSelectedCategory("todos")}
          >
            Todos
          </button>

          {orderedCategories.map((category) => (
            <button
              key={category.id}
              className={
                selectedCategory === category.slug
                  ? "storefront-pill active"
                  : "storefront-pill"
              }
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {categoryProducts.length === 0 ? (
          <p className="state-message">
            Nenhum produto encontrado para essa categoria.
          </p>
        ) : (
          <div className="storefront-products-grid">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="storefront-prescription-banner" id="receita">
        <div>
          <span>Receita e lentes</span>
          <h2>Tem receita? Envie para fazermos seu orçamento</h2>
          <p>
            Ideal para lentes de grau, multifocais, antirreflexo, blue cut ou
            opções específicas para sua rotina.
          </p>
        </div>

        <div className="storefront-prescription-card">
          <strong>Como funciona?</strong>

          <ol>
            <li>Você separa sua receita atualizada.</li>
            <li>Informa o tipo de lente ou armação desejada.</li>
            <li>Nossa equipe prepara o orçamento.</li>
          </ol>

          <button className="primary-button" type="button">
            Solicitar orçamento
          </button>
        </div>
      </section>
    </div>
  );
}