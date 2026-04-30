import type { Product } from "../../../types/product";

type ProductCardProps = {
  product: Product;
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

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = getMainImage(product);
  const price = product.salePrice ?? product.price;

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

          {product.salePrice && (
            <small>{formatPrice(product.price)}</small>
          )}
        </div>

        <a className="store-product-link" href={`/produtos/${product.slug}`}>
          Ver produto
        </a>
      </div>
    </article>
  );
}
