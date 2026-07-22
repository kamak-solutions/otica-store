import type {
  findProductById,
  findProductBySlug,
  listAdminProducts,
  listProducts,
} from "./products.service.js";

type PublicProduct =
  | Awaited<ReturnType<typeof listProducts>>[number]
  | NonNullable<Awaited<ReturnType<typeof findProductBySlug>>>;

type AdminProduct =
  | Awaited<ReturnType<typeof listAdminProducts>>[number]
  | NonNullable<Awaited<ReturnType<typeof findProductById>>>;

function mapPublicImages(product: PublicProduct) {
  return product.images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    position: image.position,
    isMain: image.isMain,
  }));
}

function mapAdminImages(product: AdminProduct) {
  return product.images.map((image) => ({
    id: image.id,
    url: image.url,
    publicId: image.publicId,
    alt: image.alt,
    position: image.position,
    isMain: image.isMain,
  }));
}

export function mapProductToPublicHttp(product: PublicProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,

    price: product.price.toFixed(2),
    salePrice: product.salePrice?.toFixed(2) ?? null,

    brand: product.brand,
    stock: product.stock,
    featured: product.featured,

    audience: product.audience,
    productType: product.productType,
    frameUse: product.frameUse,
    frameShape: product.frameShape,
    color: product.color,

    frameDetails: product.frameDetails
      ? {
          publicBrand: product.frameDetails.publicBrand,

          collection: product.frameDetails.collection
            ? {
                id: product.frameDetails.collection.id,
                code: product.frameDetails.collection.code,
                name: product.frameDetails.collection.name,
              }
            : null,

          modelCode: product.frameDetails.modelCode,

          audience: product.frameDetails.audience,
          material: product.frameDetails.material,
          shape: product.frameDetails.shape,

          primaryColor: product.frameDetails.primaryColor,
          secondaryColor: product.frameDetails.secondaryColor,
          finish: product.frameDetails.finish,

          size: {
            label: product.frameDetails.sizeLabel,
            lensWidth: product.frameDetails.lensWidth,
            bridgeWidth: product.frameDetails.bridgeWidth,
            templeLength: product.frameDetails.templeLength,
          },
        }
      : null,

    category: product.category,

    images: mapPublicImages(product),

    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function mapProductToAdminHttp(product: AdminProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,

    price: product.price.toFixed(2),
    salePrice: product.salePrice?.toFixed(2) ?? null,
    costPrice: product.costPrice?.toFixed(2) ?? null,

    sku: product.sku,
    brand: product.brand,

    stock: product.stock,
    minimumStock: product.minimumStock,

    active: product.active,
    featured: product.featured,

    audience: product.audience,
    productType: product.productType,
    frameUse: product.frameUse,
    frameShape: product.frameShape,
    color: product.color,

    frameDetails: product.frameDetails
      ? {
          id: product.frameDetails.id,

          supplier: {
            id: product.frameDetails.supplier.id,
            code: product.frameDetails.supplier.code,
            name: product.frameDetails.supplier.name,
            active: product.frameDetails.supplier.active,
          },

          collection: product.frameDetails.collection
            ? {
                id: product.frameDetails.collection.id,
                code: product.frameDetails.collection.code,
                name: product.frameDetails.collection.name,
                active: product.frameDetails.collection.active,
              }
            : null,

          supplierCode: product.frameDetails.supplierCode,
          internalCode: product.frameDetails.internalCode,
          modelCode: product.frameDetails.modelCode,
          publicBrand: product.frameDetails.publicBrand,

          audience: product.frameDetails.audience,
          material: product.frameDetails.material,
          shape: product.frameDetails.shape,

          primaryColor: product.frameDetails.primaryColor,
          secondaryColor: product.frameDetails.secondaryColor,
          finish: product.frameDetails.finish,

          size: {
            label: product.frameDetails.sizeLabel,
            lensWidth: product.frameDetails.lensWidth,
            bridgeWidth: product.frameDetails.bridgeWidth,
            templeLength: product.frameDetails.templeLength,
          },
        }
      : null,

    category: product.category,

    images: mapAdminImages(product),

    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
