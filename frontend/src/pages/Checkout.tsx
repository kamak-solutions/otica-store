import { Link } from "react-router-dom";
import { useCart } from "../store/cart/use-cart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Checkout() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="state-message">
        <h1>Checkout</h1>
        <p>Seu carrinho está vazio.</p>
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
          <h1>Finalizar pedido</h1>
          <p>Preencha seus dados para continuar.</p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form">
          <h2>Dados do cliente</h2>

          <label>
            Nome completo
            <input type="text" name="customerName" placeholder="Seu nome" />
          </label>

          <label>
            E-mail
            <input type="email" name="customerEmail" placeholder="seu@email.com" />
          </label>

          <label>
            Telefone / WhatsApp
            <input type="tel" name="customerPhone" placeholder="(11) 99999-9999" />
          </label>

          <h2>Endereço de entrega</h2>

          <div className="form-grid">
            <label>
              CEP
              <input type="text" name="zipcode" placeholder="00000-000" />
            </label>

            <label>
              Estado
              <input type="text" name="state" placeholder="SP" />
            </label>
          </div>

          <label>
            Endereço
            <input type="text" name="street" placeholder="Rua, avenida..." />
          </label>

          <div className="form-grid">
            <label>
              Número
              <input type="text" name="number" placeholder="123" />
            </label>

            <label>
              Complemento
              <input type="text" name="complement" placeholder="Apto, bloco..." />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Bairro
              <input type="text" name="district" placeholder="Bairro" />
            </label>

            <label>
              Cidade
              <input type="text" name="city" placeholder="Cidade" />
            </label>
          </div>

          <label>
            Observações
            <textarea
              name="notes"
              placeholder="Alguma observação sobre o pedido?"
              rows={4}
            />
          </label>

          <button className="primary-button" type="button">
            Enviar pedido
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Resumo do pedido</h2>

          <div className="checkout-items">
            {items.map((item) => (
              <div className="checkout-item" key={item.product.id}>
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <strong>
                  {formatCurrency(
                    Number(item.product.salePrice ?? item.product.price) *
                      item.quantity,
                  )}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}