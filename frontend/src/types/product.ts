export type ProductImage = {
  id: string;
  url: string;
  publicId: string | null;
  alt: string | null;
  position: number;
  isMain: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  sku: string | null;
  brand: string | null;
  stock: number;
  active: boolean;
  featured: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};