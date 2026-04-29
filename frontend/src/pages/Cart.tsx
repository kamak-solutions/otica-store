import { Link } from "react-router-dom";
import { useCart } from "../store/cart/use-cart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Cart() {
  const { clearCart, items, removeProduct, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="state-message">
        <h1>Carrinho vazio</h1>
        <p>Você ainda não adicionou produtos ao carrinho.</p>
        <Link className="product-link" to="/">
          Ver produtos
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <h1>Seu carrinho</h1>
          <p>Confira os produtos selecionados.</p>
        </div>

        <button className="secondary-button" type="button" onClick={clearCart}>
          Limpar carrinho
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.product.id}>
              <div>
                <h2>{item.product.name}</h2>
                <p>Quantidade: {item.quantity}</p>
                <strong>
                  {formatCurrency(
                    Number(item.product.salePrice ?? item.product.price) *
                      item.quantity,
                  )}
                </strong>
              </div>

              <button
                className="danger-button"
                type="button"
                onClick={() => removeProduct(item.product.id)}
              >
                Remover
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumo</h2>
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <button className="primary-button" type="button">
            Finalizar pedido
          </button>
        </aside>
      </div>
    </section>
  );
}