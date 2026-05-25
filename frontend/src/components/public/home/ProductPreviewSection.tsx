import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../../types/product";

type ProductPreviewSectionProps = {
  id?: string;
  kicker: string;
  title: string;
  description?: string;
  products: Product[];
  emptyMessage: string;
};

export function ProductPreviewSection({
  id,
  kicker,
  title,
  description,
  products,
  emptyMessage,
}: ProductPreviewSectionProps) {
  return (
    <section className="site-container home-section" id={id}>
      <div className="section-heading">
        <span>{kicker}</span>

        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </div>

      {products.length === 0 ? (
        <p className="section-empty-message">
          {emptyMessage}
        </p>
      ) : (
        <>
          <div className="store-products-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          <div className="products-preview-footer">
            <p>
              Veja nossa coleção completa com filtros,
              categorias e todos os modelos disponíveis.
            </p>

            <Link
              className="button-primary"
              to="/produtos"
            >
              Ver catálogo completo →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}