import { Link } from "react-router-dom";
import { useCart } from "../../store/cart/use-cart";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function MiniCart() {
  const {
    items,
    subtotal,
    incrementProduct,
    decrementProduct,
    removeProduct,
  } = useCart();

  return (
    <div className="mini-cart">
      <div className="mini-cart-header">
        <strong>Meu carrinho</strong>
        <span>{items.length} item(s)</span>
      </div>

      {items.length === 0 ? (
        <p className="mini-cart-empty">
          Seu carrinho está vazio
        </p>
      ) : (
        <>
          <div className="mini-cart-items">

            {items.map((item) => (
              <div
                className="mini-cart-item"
                key={item.productId}
              >
                <div className="mini-cart-product">

                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  )}

                  <div>

                    <strong>{item.name}</strong>

                    <span>
                      {formatPrice(
                        Number(item.unitPrice)
                      )}
                    </span>

                    <div className="mini-cart-quantity">

                      <button
                        onClick={() =>
                          decrementProduct(
                            item.productId,
                          )
                        }
                        type="button"
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          incrementProduct(
                            item.productId,
                          )
                        }
                        type="button"
                      >
                        +
                      </button>

                    </div>

                    <button
                      className="mini-cart-remove"
                      type="button"
                      onClick={() =>
                        removeProduct(
                          item.productId,
                        )
                      }
                    >
                      Remover
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>

          <div className="mini-cart-footer">

            <div className="mini-cart-total">
              <span>Subtotal</span>

              <strong>
                {formatPrice(subtotal)}
              </strong>
            </div>

            <div className="mini-cart-actions">

              <Link to="/carrinho">
                Ver carrinho
              </Link>

              <Link to="/checkout">
                Finalizar
              </Link>

            </div>

          </div>
        </>
      )}
    </div>
  );
}