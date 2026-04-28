export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  active: boolean;
};

const products: Product[] = [
  {
    id: "1",
    name: "Óculos Solar Premium",
    slug: "oculos-solar-premium",
    description: "Óculos solar elegante para uso diário.",
    price: 199.9,
    stock: 10,
    active: true,
  },
  {
    id: "2",
    name: "Armação Feminina Clássica",
    slug: "armacao-feminina-classica",
    description: "Armação leve e confortável.",
    price: 149.9,
    stock: 5,
    active: true,
  },
];

export async function listProducts() {
  return products.filter((product) => product.active);
}