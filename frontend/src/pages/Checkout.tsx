import { useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../services/orders.service";
import { useCart } from "../store/cart/use-cart";

type CheckoutFormData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  notes: string;
};

const initialFormData: CheckoutFormData = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  zipcode: "",
  state: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  notes: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Checkout() {
  const { clearCart, items, subtotal } = useCart();

  const [formData, setFormData] =
    useState<CheckoutFormData>(initialFormData);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof CheckoutFormData, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const orderPayload = {
      customer: formData,
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
      })),
      subtotal,
    };

    try {
      const response = await createOrder(orderPayload);

      clearCart();

      setSuccessMessage(
        `Pedido criado com sucesso! Código do pedido: ${response.data.id}`,
      );

      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar pedido.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0 && !successMessage) {
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

      {successMessage && <div className="success-message">{successMessage}</div>}

      {errorMessage && <div className="error-alert">{errorMessage}</div>}

      {!successMessage && (
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Dados do cliente</h2>

            <label>
              Nome completo
              <input
                type="text"
                name="customerName"
                placeholder="Seu nome"
                value={formData.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                name="customerEmail"
                placeholder="seu@email.com"
                value={formData.customerEmail}
                onChange={(event) =>
                  updateField("customerEmail", event.target.value)
                }
              />
            </label>

            <label>
              Telefone / WhatsApp
              <input
                type="tel"
                name="customerPhone"
                placeholder="(11) 99999-9999"
                value={formData.customerPhone}
                onChange={(event) =>
                  updateField("customerPhone", event.target.value)
                }
              />
            </label>

            <h2>Endereço de entrega</h2>

            <div className="form-grid">
              <label>
                CEP
                <input
                  type="text"
                  name="zipcode"
                  placeholder="00000-000"
                  value={formData.zipcode}
                  onChange={(event) =>
                    updateField("zipcode", event.target.value)
                  }
                />
              </label>

              <label>
                Estado
                <input
                  type="text"
                  name="state"
                  placeholder="SP"
                  value={formData.state}
                  onChange={(event) => updateField("state", event.target.value)}
                />
              </label>
            </div>

            <label>
              Endereço
              <input
                type="text"
                name="street"
                placeholder="Rua, avenida..."
                value={formData.street}
                onChange={(event) => updateField("street", event.target.value)}
              />
            </label>

            <div className="form-grid">
              <label>
                Número
                <input
                  type="text"
                  name="number"
                  placeholder="123"
                  value={formData.number}
                  onChange={(event) =>
                    updateField("number", event.target.value)
                  }
                />
              </label>

              <label>
                Complemento
                <input
                  type="text"
                  name="complement"
                  placeholder="Apto, bloco..."
                  value={formData.complement}
                  onChange={(event) =>
                    updateField("complement", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-grid">
              <label>
                Bairro
                <input
                  type="text"
                  name="district"
                  placeholder="Bairro"
                  value={formData.district}
                  onChange={(event) =>
                    updateField("district", event.target.value)
                  }
                />
              </label>

              <label>
                Cidade
                <input
                  type="text"
                  name="city"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                />
              </label>
            </div>

            <label>
              Observações
              <textarea
                name="notes"
                placeholder="Alguma observação sobre o pedido?"
                rows={4}
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </label>

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando pedido..." : "Enviar pedido"}
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
      )}

      {successMessage && (
        <Link className="product-link" to="/">
          Voltar para produtos
        </Link>
      )}
    </section>
  );
}