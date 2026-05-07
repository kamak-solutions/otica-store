import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../../services/orders.service";
import { useCart } from "../../store/cart/use-cart";

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

function formatPrice(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function Checkout() {
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      formData.customerName.trim() &&
      formData.customerEmail.trim() &&
      formData.customerPhone.trim() &&
      formData.zipcode.trim() &&
      formData.state.trim() &&
      formData.street.trim() &&
      formData.number.trim() &&
      formData.district.trim() &&
      formData.city.trim()
    );
  }, [items.length, formData]);

  function updateField(field: keyof CheckoutFormData, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Preencha os campos obrigatórios para finalizar.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createOrder({
        customer: {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          zipcode: formData.zipcode,
          state: formData.state,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || undefined,
          district: formData.district,
          city: formData.city,
          notes: formData.notes || undefined,
        },
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        subtotal,
      });

      setCreatedOrderNumber(response.data.orderNumber ?? response.data.id);
      clearCart();
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar pedido.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdOrderNumber) {
    return (
      <main className="page-shell">
        <section className="order-success-card">
          <div className="order-success-icon">✓</div>

          <span>Pedido recebido</span>

          <h1>Seu pedido foi criado com sucesso</h1>

          <p>
            Recebemos sua solicitação. Nossa equipe poderá seguir com a
            confirmação dos produtos, atendimento, frete, lentes ou orçamento
            personalizado.
          </p>

          <div className="order-success-number">
            <small>Número do pedido</small>
            <strong>{createdOrderNumber}</strong>
          </div>

          <div className="order-success-steps">
            <article>
              <strong>1</strong>
              <span>Seu pedido fica com status pendente.</span>
            </article>

            <article>
              <strong>2</strong>
              <span>Nossa equipe confirma os detalhes do atendimento.</span>
            </article>

            <article>
              <strong>3</strong>
              <span>
                Você recebe orientação sobre pagamento, retirada ou entrega.
              </span>
            </article>
          </div>

          <div className="order-success-actions">
            <Link className="button-primary" to="/">
              Voltar para a vitrine
            </Link>

            <Link className="button-secondary" to="/orcamento">
              Solicitar orçamento com receita
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <span>Checkout</span>
          <h1>Seu carrinho está vazio</h1>
          <p>Adicione produtos ao carrinho antes de finalizar o pedido.</p>

          <Link className="button-primary" to="/">
            Continuar comprando
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="checkout-heading">
        <span>Checkout</span>
        <h1>Finalizar pedido</h1>
        <p>Informe seus dados para criar o pedido na Ótica ShowRoom.</p>
      </section>

      {errorMessage && <div className="checkout-error">{errorMessage}</div>}

      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-card">
            <h2>Dados do cliente</h2>

            <label>
              Nome completo *
              <input
                type="text"
                value={formData.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
                required
              />
            </label>

            <div className="checkout-form-grid">
              <label>
                E-mail *
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(event) =>
                    updateField("customerEmail", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Telefone / WhatsApp *
                <input
                  type="text"
                  value={formData.customerPhone}
                  onChange={(event) =>
                    updateField("customerPhone", event.target.value)
                  }
                  required
                />
              </label>
            </div>
          </section>

          <section className="checkout-card">
            <h2>Endereço</h2>

            <div className="checkout-form-grid">
              <label>
                CEP *
                <input
                  type="text"
                  value={formData.zipcode}
                  onChange={(event) =>
                    updateField("zipcode", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Estado / UF *
                <input
                  type="text"
                  value={formData.state}
                  onChange={(event) =>
                    updateField(
                      "state",
                      event.target.value.toUpperCase().slice(0, 2),
                    )
                  }
                  placeholder="SP"
                  maxLength={2}
                  required
                />
              </label>
            </div>

            <label>
              Rua *
              <input
                type="text"
                value={formData.street}
                onChange={(event) => updateField("street", event.target.value)}
                required
              />
            </label>

            <div className="checkout-form-grid">
              <label>
                Número *
                <input
                  type="text"
                  value={formData.number}
                  onChange={(event) =>
                    updateField("number", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Complemento
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(event) =>
                    updateField("complement", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="checkout-form-grid">
              <label>
                Bairro *
                <input
                  type="text"
                  value={formData.district}
                  onChange={(event) =>
                    updateField("district", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Cidade *
                <input
                  type="text"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Observações
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                rows={4}
                placeholder="Ex: quero orçamento de lentes, entrega, retirada, preferência de atendimento..."
              />
            </label>
          </section>

          <button
            className="button-primary checkout-submit-button"
            type="submit"
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Criando pedido..." : "Criar pedido"}
          </button>
        </form>

        <aside className="checkout-summary">
          <span>Resumo do pedido</span>

          <div className="checkout-summary-items">
            {items.map((item) => (
              <article key={item.productId}>
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </small>
                </div>

                <span>
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </article>
            ))}
          </div>

          <div className="checkout-total-row">
            <p>Subtotal</p>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <p className="checkout-note">
            O pedido será criado como pendente. Frete, lentes sob medida e
            condições finais podem ser confirmados no atendimento.
          </p>

          <Link className="button-secondary" to="/carrinho">
            Voltar ao carrinho
          </Link>
        </aside>
      </section>
    </main>
  );
}
