import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { listAdminProducts } from "../../services/admin-products.service";
import type { Product } from "../../types/product";

type OrderItemDraft = {
  product: Product;
  quantity: number;
};

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AdminCustomerOrderCreate() {
  const { id } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<OrderItemDraft[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const response = await listAdminProducts();

      setProducts(response.data);
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products.slice(0, 8);
    }

    return products
      .filter((product) =>
        [product.name, product.sku ?? "", product.brand ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
      .slice(0, 8);
  }, [products, searchTerm]);

  const subtotal = items.reduce((total, item) => {
    return (
      total +
      Number(item.product.salePrice ?? item.product.price) * item.quantity
    );
  }, 0);

  function addProduct(product: Product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
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

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Novo pedido</h1>
          <p>Pedido vinculado ao cliente.</p>
        </div>

        <Link to={`/admin/clientes/${id}`}>
          <button type="button">Voltar ao CRM</button>
        </Link>
      </div>

      <div className="admin-order-create-layout">
        <section className="admin-form-card">
          <h2>Buscar produtos</h2>

          <label>
            Produto
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Busque por nome, SKU ou marca..."
            />
          </label>

          <div className="admin-product-picker-list">
            {filteredProducts.map((product) => (
              <article className="admin-product-picker-item" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{formatPrice(product.salePrice ?? product.price)}</span>
                </div>

                <button type="button" onClick={() => addProduct(product)}>
                  Adicionar
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-form-card">
          <h2>Itens do pedido</h2>

          {items.length === 0 ? (
            <p>Nenhum produto adicionado.</p>
          ) : (
            <div className="admin-order-items">
              {items.map((item) => (
                <article className="admin-order-item" key={item.product.id}>
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>
                      {formatPrice(
                        item.product.salePrice ?? item.product.price,
                      )}
                    </span>
                  </div>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(
                        item.product.id,
                        Number(event.target.value),
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeProduct(item.product.id)}
                  >
                    Remover
                  </button>
                </article>
              ))}
            </div>
          )}

          <label>
            Observações
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Observações internas do pedido..."
            />
          </label>

          <div className="admin-order-total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <button
            className="admin-submit-button"
            type="button"
            disabled={items.length === 0}
          >
            Salvar pedido
          </button>
        </section>
      </div>
    </section>
  );
}
