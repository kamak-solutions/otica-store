import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = getMainImage(product);

  return (
    <article className="product-card">
      {product.featured && <span className="product-badge">Destaque</span>}

      {mainImage ? (
        <img
          className="product-image"
          src={mainImage.url}
          alt={mainImage.alt ?? product.name}
        />
      ) : (
        <div className="product-image-placeholder">
          <span>Ótica ShowRoom</span>
        </div>
      )}

      <div className="product-content">
        <h2>{product.name}</h2>

        {product.description && <p>{product.description}</p>}

        <div className="product-price">
          {product.salePrice ? (
            <>
              <span className="old-price">R$ {product.price}</span>
              <strong>R$ {product.salePrice}</strong>
            </>
          ) : (
            <strong>R$ {product.price}</strong>
          )}
        </div>

        <Link className="product-link" to={`/produtos/${product.slug}`}>
          Ver produto
        </Link>
      </div>
    </article>
  );
}