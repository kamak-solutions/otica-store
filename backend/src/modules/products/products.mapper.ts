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
    audience: product.audience,
    category: product.category,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      alt: image.alt,
      position: image.position,
      isMain: image.isMain,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
