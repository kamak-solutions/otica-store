import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../../types/product";

type ProductPreviewSectionProps = {
  id?: string;
  kicker: string;
  title: string;
  description?: string;
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  products: Product[];
  emptyMessage: string;
};

export function ProductPreviewSection({
  id,
  kicker,
  title,
  description,
  filters,
  activeFilter,
  onFilterChange,
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

      <div className="pill-list">
        {filters.map((filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "pill-active" : ""}
            type="button"
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="section-empty-message">{emptyMessage}</p>
      ) : (
        <div className="store-products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
