import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../../services/products.service";
import type { Product } from "../../types/product";
import { useCart } from "../../store/cart/use-cart";

function formatPrice(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setErrorMessage("Produto inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProductBySlug(slug);
        const mainImage = getMainImage(response.data);

        setProduct(response.data);
        setSelectedImageUrl(mainImage?.url ?? "");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar produto.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [slug]);
  const { addProduct } = useCart();

  const price = useMemo(() => {
    if (!product) {
      return null;
    }

    return product.salePrice ?? product.price;
  }, [product]);

  if (isLoading) {
    return (
      <main className="page-shell">
        <p className="section-empty-message">Carregando produto...</p>
      </main>
    );
  }

  if (errorMessage || !product || !price) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <span>Produto</span>
          <h1>Produto não encontrado</h1>
          <p>{errorMessage || "Não conseguimos encontrar este produto."}</p>

          <Link className="button-primary" to="/">
            Voltar para a vitrine
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Link className="back-link" to="/">
        ← Voltar para a vitrine
      </Link>

      <section className="product-detail-layout">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            {selectedImageUrl ? (
              <img src={selectedImageUrl} alt={product.name} />
            ) : (
              <div className="store-product-placeholder">
                <span>Sem imagem</span>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="product-detail-thumbs">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  className={selectedImageUrl === image.url ? "active" : ""}
                  type="button"
                  onClick={() => setSelectedImageUrl(image.url)}
                >
                  <img src={image.url} alt={image.alt ?? product.name} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="store-product-meta">
            {product.category?.name && <span>{product.category.name}</span>}
            {product.audience && <span>{product.audience}</span>}
          </div>

          <h1>{product.name}</h1>

          {product.description && <p>{product.description}</p>}

          <div className="product-detail-price">
            <strong>{formatPrice(price)}</strong>

            {product.salePrice && <small>{formatPrice(product.price)}</small>}
          </div>

          <div className="product-detail-stock">
            {product.stock > 0 ? (
              <span>Disponível em estoque</span>
            ) : (
              <span>Produto indisponível no momento</span>
            )}
          </div>

          <div className="product-detail-actions">
            <button
              className="button-primary"
              type="button"
              disabled={product.stock === 0}
              onClick={() => addProduct(product)}
            >
              {product.stock === 0
                ? "Produto indisponível"
                : "Adicionar ao carrinho"}
            </button>

            <Link className="button-secondary" to="/orcamento">
              Solicitar orçamento
            </Link>
          </div>

          <div className="product-detail-note">
            <strong>Atendimento personalizado</strong>
            <p>
              Para lentes de grau, envie sua receita e solicite uma orientação
              personalizada com nossa equipe.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
