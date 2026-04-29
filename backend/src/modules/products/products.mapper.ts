import type { listProducts } from "./products.service.js";

type ProductListItem = Awaited<ReturnType<typeof listProducts>>[number];

export function mapProductToHttp(product: ProductListItem) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toFixed(2),
    salePrice: product.salePrice ? product.salePrice.toFixed(2) : null,
    sku: product.sku,
    brand: product.brand,
    stock: product.stock,
    active: product.active,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}