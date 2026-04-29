import type { CartItem } from "../../store/cart/cart-context";

type CheckoutSummaryProps = {
  items: CartItem[];
  subtotal: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CheckoutSummary({ items, subtotal }: CheckoutSummaryProps) {
  return (
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
  );
}
