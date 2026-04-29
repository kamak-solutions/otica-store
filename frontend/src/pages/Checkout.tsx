import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary";
import { createOrder } from "../services/orders.service";
import { useCart } from "../store/cart/use-cart";
import {
  initialCheckoutFormData,
  type CheckoutFormData,
} from "../types/checkout";

export function Checkout() {
  const { clearCart, items, subtotal } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>(
    initialCheckoutFormData,
  );

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
        `Pedido criado com sucesso! Código do pedido: ${
          response.data.orderNumber ?? response.data.id
        }`,
      );

      setFormData(initialCheckoutFormData);
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

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errorMessage && <div className="error-alert">{errorMessage}</div>}

      {!successMessage && (
        <div className="checkout-layout">
          <CheckoutForm
            formData={formData}
            isSubmitting={isSubmitting}
            onChangeField={updateField}
            onSubmit={handleSubmit}
          />

          <CheckoutSummary items={items} subtotal={subtotal} />
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
