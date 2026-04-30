import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/products/ProductCard";
import { getProducts } from "../services/products.service";
import type { Product } from "../types/product";

type AudienceFilter = "todos" | "feminino" | "masculino" | "infantil" | "unissex";

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

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedAudience, setSelectedAudience] =
    useState<AudienceFilter>("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getProducts();
        setProducts(response.data);
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

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedAudience === "todos") {
      return products;
    }

    return products.filter(
      (product) => product.audience === selectedAudience,
    );
  }, [products, selectedAudience]);

  if (isLoading) {
    return <p className="state-message">Carregando produtos...</p>;
  }

  if (error) {
    return <p className="state-message error-message">{error}</p>;
  }

  return (
    <>
      <section className="hero">
        <span className="hero-kicker">Ótica ShowRoom</span>
        <h1>Encontre óculos e armações para o seu estilo</h1>
        <p>
          Produtos selecionados com conforto, qualidade e atendimento
          personalizado.
        </p>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <h2>Produtos disponíveis</h2>
            <p>{filteredProducts.length} produto(s) encontrado(s)</p>
          </div>
        </div>

        <div className="product-filters">
          {audienceFilters.map((filter) => (
            <button
              key={filter.value}
              className={
                selectedAudience === filter.value
                  ? "filter-button filter-button-active"
                  : "filter-button"
              }
              type="button"
              onClick={() => setSelectedAudience(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="state-message">
            Nenhum produto encontrado para esse filtro.
          </p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}