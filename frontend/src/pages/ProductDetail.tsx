import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/products.service";
import type { Product } from "../types/product";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setError("Produto inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProductBySlug(slug);
        setProduct(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar produto.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (isLoading) {
    return <p>Carregando produto...</p>;
  }

  if (error) {
    return (
      <section>
        <p>{error}</p>
        <Link to="/">Voltar para a loja</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section>
        <p>Produto não encontrado.</p>
        <Link to="/">Voltar para a loja</Link>
      </section>
    );
  }

  return (
    <section>
      <Link to="/">← Voltar</Link>

      <h1>{product.name}</h1>

      {product.description && <p>{product.description}</p>}

      <p>
        {product.salePrice ? (
          <>
            <span>De R$ {product.price}</span>{" "}
            <strong>Por R$ {product.salePrice}</strong>
          </>
        ) : (
          <strong>R$ {product.price}</strong>
        )}
      </p>

      <p>Estoque: {product.stock}</p>

      {product.brand && <p>Marca: {product.brand}</p>}
    </section>
  );
}
