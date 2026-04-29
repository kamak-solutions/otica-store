import { useEffect, useState } from "react";
import { ProductCard } from "../components/products/ProductCard";
import { getProducts } from "../services/products.service";
import type { Product } from "../types/product";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
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
          <h2>Produtos disponíveis</h2>
          <p>{products.length} produto(s) encontrado(s)</p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
