import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../../types/product";

const CART_STORAGE_KEY = "@otica-showroom:cart";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unitPrice: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  incrementProduct: (productId: string) => void;
  decrementProduct: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

function getProductPrice(product: Product) {
  return product.salePrice ?? product.price;
}

function loadCartFromStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart;
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addProduct(product: Product) {
    const mainImage = getMainImage(product);

    setItems((currentItems) => {
      const productAlreadyInCart = currentItems.find(
        (item) => item.productId === product.id,
      );

      if (productAlreadyInCart) {
        return currentItems.map((item) =>
          item.productId === product.id
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
          productId: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: mainImage?.url ?? null,
          unitPrice: getProductPrice(product),
          quantity: 1,
        },
      ];
    });
  }

  function removeProduct(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  function incrementProduct(productId: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function decrementProduct(productId: string) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
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
      return total + Number(item.unitPrice) * item.quantity;
    }, 0);
  }, [items]);

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addProduct,
    removeProduct,
    incrementProduct,
    decrementProduct,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
