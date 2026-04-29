import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../../types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
};

type CartProviderProps = {
  children: ReactNode;
};

const CART_STORAGE_KEY = "@otica-showroom:cart";

export const CartContext = createContext<CartContextValue | null>(null);

function getProductPrice(product: Product) {
  return Number(product.salePrice ?? product.price);
}

function loadCartFromStorage(): CartItem[] {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    return JSON.parse(storedCart) as CartItem[];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addProduct(product: Product) {
    setItems((currentItems) => {
      const productAlreadyInCart = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (productAlreadyInCart) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: 1,
        },
      ];
    });
  }

  function removeProduct(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + getProductPrice(item.product) * item.quantity;
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addProduct,
      removeProduct,
      clearCart,
    }),
    [items, totalItems, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}