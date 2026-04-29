import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/products.service";
import { useCart } from "../store/cart/use-cart";
import type { Product } from "../types/product";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addProduct, items } = useCart();

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
          error instanceof Error ? error.message : "Erro ao carregar produto.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (isLoading) {
    return <p className="state-message">Carregando produto...</p>;
  }

  if (error) {
    return (
      <section className="state-message error-message">
        <p>{error}</p>
        <Link to="/">Voltar para a loja</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="state-message">
        <p>Produto não encontrado.</p>
        <Link to="/">Voltar para a loja</Link>
      </section>
    );
  }

  const hasSalePrice = Boolean(product.salePrice);

  const mainImage =
    product.images.find((image) => image.isMain) ?? product.images[0];

  const productAlreadyInCart = items.some(
    (item) => item.product.id === product.id,
  );

  return (
    <section className="product-detail">
      <Link className="back-link" to="/">
        ← Voltar para produtos
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.featured && <span className="product-badge">Destaque</span>}

          {mainImage ? (
            <img
              className="product-detail-photo"
              src={mainImage.url}
              alt={mainImage.alt ?? product.name}
            />
          ) : (
            <span>Ótica ShowRoom</span>
          )}
        </div>
        <div className="product-detail-content">
          {product.brand && (
            <span className="product-brand">{product.brand}</span>
          )}

          <h1>{product.name}</h1>

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          <div className="product-detail-price">
            {hasSalePrice ? (
              <>
                <span className="old-price">De R$ {product.price}</span>
                <strong>Por R$ {product.salePrice}</strong>
              </>
            ) : (
              <strong>R$ {product.price}</strong>
            )}
          </div>

          <div className="product-detail-info">
            <div>
              <span>Estoque</span>
              <strong>{product.stock} unidade(s)</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{product.active ? "Disponível" : "Indisponível"}</strong>
            </div>

            {product.sku && (
              <div>
                <span>SKU</span>
                <strong>{product.sku}</strong>
              </div>
            )}
          </div>

          {productAlreadyInCart ? (
            <div className="cart-feedback-box">
              <p>Este produto já está no carrinho.</p>

              <Link className="primary-button text-center" to="/carrinho">
                Ver carrinho
              </Link>
            </div>
          ) : (
            <button
              className="primary-button"
              type="button"
              onClick={() => addProduct(product)}
            >
              Adicionar ao carrinho
            </button>
          )}

          <p className="detail-note">
            Atendimento personalizado para ajudar você a escolher a melhor
            opção.
          </p>
        </div>
      </div>
    </section>
  );
}
