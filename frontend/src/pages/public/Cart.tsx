import { Link } from "react-router-dom";
import { useCart } from "../../store/cart/use-cart";

function formatPrice(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function Cart() {
  const {
    items,
    subtotal,
    incrementProduct,
    decrementProduct,
    removeProduct,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <span>Carrinho</span>
          <h1>Seu carrinho está vazio</h1>
          <p>
            Explore nossa vitrine, escolha seus produtos e depois volte aqui
            para finalizar seu pedido.
          </p>

          <Link className="button-primary" to="/">
            Continuar comprando
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="cart-heading">
        <div>
          <span>Carrinho</span>
          <h1>Seu carrinho</h1>
          <p>Revise seus produtos antes de continuar para o checkout.</p>
        </div>

        <button className="cart-clear-button" type="button" onClick={clearCart}>
          Limpar carrinho
        </button>
      </section>

      <section className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.productId}>
              <Link
                className="cart-item-image"
                to={`/produtos/${item.slug}`}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <span>Sem imagem</span>
                )}
              </Link>

              <div className="cart-item-info">
                <Link to={`/produtos/${item.slug}`}>
                  <h2>{item.name}</h2>
                </Link>

                <span>{formatPrice(item.unitPrice)}</span>

                <button
                  className="cart-remove-button"
                  type="button"
                  onClick={() => removeProduct(item.productId)}
                >
                  Remover
                </button>
              </div>

              <div className="cart-quantity-control">
                <button
                  type="button"
                  onClick={() => decrementProduct(item.productId)}
                  aria-label={`Diminuir quantidade de ${item.name}`}
                >
                  −
                </button>

                <strong>{item.quantity}</strong>

                <button
                  type="button"
                  onClick={() => incrementProduct(item.productId)}
                  aria-label={`Aumentar quantidade de ${item.name}`}
                >
                  +
                </button>
              </div>

              <strong className="cart-item-total">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </strong>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span>Resumo</span>

          <div className="cart-summary-row">
            <p>Subtotal</p>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <p className="cart-summary-note">
            Frete, lentes sob medida e condições finais podem ser confirmados no
            atendimento ou checkout.
          </p>

          <Link className="button-primary" to="/checkout">
            Finalizar pedido
          </Link>

          <Link className="button-secondary" to="/">
            Continuar comprando
          </Link>
        </aside>
      </section>
    </main>
  );
}
