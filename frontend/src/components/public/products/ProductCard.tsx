import type { Product } from "../../../types/product";

type ProductCardProps = {
  product: Product;
};

type ProductBadge = {
  label: string;
  variant: "featured" | "sale" | "new" | "low-stock" | "sold-out";
};

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

function formatPrice(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function isNewProduct(createdAt: string) {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const differenceInDays =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  return differenceInDays <= 30;
}

function getProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];

  if (product.stock === 0) {
    badges.push({
      label: "Esgotado",
      variant: "sold-out",
    });

    return badges;
  }

  if (product.featured) {
    badges.push({
      label: "Destaque",
      variant: "featured",
    });
  }

  if (product.salePrice) {
    badges.push({
      label: "Oferta",
      variant: "sale",
    });
  }

  if (isNewProduct(product.createdAt)) {
    badges.push({
      label: "Novo",
      variant: "new",
    });
  }

  if (product.stock > 0 && product.stock <= 3) {
    badges.push({
      label: "Últimas unidades",
      variant: "low-stock",
    });
  }

  return badges.slice(0, 3);
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = getMainImage(product);
  const price = product.salePrice ?? product.price;
  const badges = getProductBadges(product);

  function handleFavoriteClick() {
    console.log("Favoritar produto:", product.id);
  }

  function handleShareClick() {
    console.log("Compartilhar produto:", product.slug);
  }

  return (
    <article className="store-product-card">
      <div className="store-product-image-area">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.alt ?? product.name}
            className="store-product-image"
          />
        ) : (
          <div className="store-product-placeholder">
            <span>Sem imagem</span>
          </div>
        )}

        {badges.length > 0 && (
          <div className="store-product-badges">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`store-product-badge store-product-badge-${badge.variant}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <div className="store-product-actions">
          <button
            type="button"
            aria-label={`Favoritar ${product.name}`}
            onClick={handleFavoriteClick}
          >
            ♡
          </button>

          <button
            type="button"
            aria-label={`Compartilhar ${product.name}`}
            onClick={handleShareClick}
          >
            ↗
          </button>
        </div>
      </div>

      <div className="store-product-content">
        <div className="store-product-meta">
          {product.category?.name && <span>{product.category.name}</span>}
          {product.audience && <span>{product.audience}</span>}
        </div>

        <h3>{product.name}</h3>

        {product.description && <p>{product.description}</p>}

        <div className="store-product-price-row">
          <strong>{formatPrice(price)}</strong>

          {product.salePrice && <small>{formatPrice(product.price)}</small>}
        </div>

        <a className="store-product-link" href={`/produtos/${product.slug}`}>
          Ver produto
        </a>
      </div>
    </article>
  );
}